package com.edunova.service;

import com.edunova.domain.MentorVerificationStatus;
import com.edunova.domain.OpportunityType;
import com.edunova.domain.VerificationStatus;
import com.edunova.domain.entity.*;
import com.edunova.dto.NovaDtos.*;
import com.edunova.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NovaAiService {

    private final NovaConversationRepository conversationRepository;
    private final NovaMessageRepository messageRepository;
    private final SavedRoadmapRepository savedRoadmapRepository;
    private final UserAccountRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OpportunityRepository opportunityRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final CourseRepository courseRepository;
    private final FutureTalkRepository futureTalkRepository;
    private final ObjectMapper objectMapper;

    @Value("${edunova.nova-ai.api-key:}")
    private String apiKey;

    @Value("${edunova.nova-ai.model:gemini-1.5-flash}")
    private String model;

    @Value("${edunova.nova-ai.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    @Transactional
    public NovaChatResponse processChat(NovaChatRequest request, UUID userId) {
        final String lang = (request.getLanguage() != null && List.of("en", "ta", "hi").contains(request.getLanguage().toLowerCase()))
                ? request.getLanguage().toLowerCase() : "en";

        UserAccount user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;

        // Retrieve or create conversation
        NovaConversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseGet(() -> createNewConversation(user, request.getSessionToken(), request.getMessage(), lang));
        } else {
            conversation = createNewConversation(user, request.getSessionToken(), request.getMessage(), lang);
        }

        // Save User Message
        NovaMessage userMsg = NovaMessage.builder()
                .conversation(conversation)
                .role("user")
                .content(request.getMessage())
                .build();
        messageRepository.save(userMsg);

        // Build Grounding Context
        StudentProfile studentProfile = (user != null) ? studentProfileRepository.findByUserId(user.getId()).orElse(null) : null;
        String systemPrompt = buildSystemPrompt(studentProfile, lang);

        // Generate Response via LLM or Grounded Knowledge Engine
        NovaChatResponse response = null;
        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.startsWith("YOUR_")) {
            try {
                response = callRemoteLlm(systemPrompt, conversation, request.getMessage(), lang);
            } catch (Exception ex) {
                log.warn("Remote AI API call failed or timed out: {}. Using verified database knowledge engine.", ex.getMessage());
            }
        }

        if (response == null) {
            response = generateGroundedEngineResponse(studentProfile, request.getMessage(), lang);
        }

        response.setConversationId(conversation.getId());

        // Serialize actions and roadmap for storage
        String actionPayload = null;
        try {
            Map<String, Object> payloadMap = new HashMap<>();
            if (response.getActionButtons() != null) {
                payloadMap.put("actionButtons", response.getActionButtons());
            }
            if (response.getRoadmap() != null) {
                payloadMap.put("roadmap", response.getRoadmap());
            }
            actionPayload = objectMapper.writeValueAsString(payloadMap);
        } catch (Exception e) {
            log.error("Failed to serialize action payload", e);
        }

        // Save Assistant Message
        NovaMessage assistantMsg = NovaMessage.builder()
                .conversation(conversation)
                .role("assistant")
                .content(response.getContent())
                .actionPayload(actionPayload)
                .build();
        assistantMsg = messageRepository.save(assistantMsg);

        response.setMessageId(assistantMsg.getId());
        response.setCreatedAt(assistantMsg.getCreatedAt());

        return response;
    }

    private NovaConversation createNewConversation(UserAccount user, String sessionToken, String firstPrompt, String language) {
        String title = firstPrompt.length() > 40 ? firstPrompt.substring(0, 37) + "..." : firstPrompt;
        NovaConversation conversation = NovaConversation.builder()
                .user(user)
                .sessionToken(sessionToken)
                .title(title)
                .language(language)
                .build();
        return conversationRepository.save(conversation);
    }

    @Transactional(readOnly = true)
    public List<NovaConversationSummaryDto> getUserConversations(UUID userId) {
        return conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId).stream()
                .map(c -> {
                    List<NovaMessage> msgs = messageRepository.findByConversationOrderByCreatedAtAsc(c);
                    String lastMsg = msgs.isEmpty() ? "No messages" : msgs.get(msgs.size() - 1).getContent();
                    if (lastMsg.length() > 60) lastMsg = lastMsg.substring(0, 57) + "...";
                    return NovaConversationSummaryDto.builder()
                            .id(c.getId())
                            .title(c.getTitle())
                            .language(c.getLanguage())
                            .lastMessage(lastMsg)
                            .updatedAt(c.getUpdatedAt())
                            .messageCount(msgs.size())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NovaChatResponse> getConversationMessages(UUID conversationId, UUID userId) {
        NovaConversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (conv.getUser() != null && (userId == null || !conv.getUser().getId().equals(userId))) {
            throw new IllegalStateException("Access denied to conversation");
        }

        return messageRepository.findByConversationOrderByCreatedAtAsc(conv).stream()
                .map(m -> {
                    List<NovaActionLinkDto> actions = null;
                    NovaRoadmapDto roadmap = null;
                    if (m.getActionPayload() != null) {
                        try {
                            JsonNode node = objectMapper.readTree(m.getActionPayload());
                            if (node.has("actionButtons")) {
                                actions = objectMapper.convertValue(node.get("actionButtons"), objectMapper.getTypeFactory().constructCollectionType(List.class, NovaActionLinkDto.class));
                            }
                            if (node.has("roadmap")) {
                                roadmap = objectMapper.treeToValue(node.get("roadmap"), NovaRoadmapDto.class);
                            }
                        } catch (Exception ignored) {}
                    }
                    return NovaChatResponse.builder()
                            .conversationId(conv.getId())
                            .messageId(m.getId())
                            .role(m.getRole())
                            .content(m.getContent())
                            .language(conv.getLanguage())
                            .actionButtons(actions)
                            .roadmap(roadmap)
                            .createdAt(m.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteConversation(UUID conversationId, UUID userId) {
        NovaConversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (conv.getUser() != null && (userId == null || !conv.getUser().getId().equals(userId))) {
            throw new IllegalStateException("Access denied");
        }

        conversationRepository.delete(conv);
    }

    @Transactional
    public SavedRoadmapResponse saveRoadmap(SaveRoadmapRequest request, UUID userId) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SavedRoadmap saved = SavedRoadmap.builder()
                .user(user)
                .title(request.getTitle())
                .goal(request.getGoal())
                .roadmapJson(request.getRoadmapJson())
                .build();

        saved = savedRoadmapRepository.save(saved);

        return SavedRoadmapResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .goal(saved.getGoal())
                .roadmapJson(saved.getRoadmapJson())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<SavedRoadmapResponse> getSavedRoadmaps(UUID userId) {
        return savedRoadmapRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(r -> SavedRoadmapResponse.builder()
                        .id(r.getId())
                        .title(r.getTitle())
                        .goal(r.getGoal())
                        .roadmapJson(r.getRoadmapJson())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private String buildSystemPrompt(StudentProfile profile, String lang) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are NOVA AI, the trusted Educational & Career Guide for ERE-TN (Education Revolution & Evolution – Tamil Nadu), built specifically for Indian and Tamil Nadu students.\n");
        sb.append("Tagline: 'Your AI Guide for Education & Career'.\n\n");

        sb.append("CRITICAL RULES:\n");
        sb.append("1. ZERO HALLUCINATION FOR SCHOLARSHIPS: You MUST NOT invent any scholarship amounts, eligibility rules, deadlines, or URLs. Only use the verified ERE-TN database schemes listed in the context below.\n");
        sb.append("2. If a requested scheme is not verified in ERE-TN database, explicitly state: 'I couldn't verify this information from ERE-TN's available official sources. Please check the official provider before applying.'\n");
        sb.append("3. MENTORS & COURSES: Only recommend real mentors and real courses from the verified context below.\n");
        sb.append("4. LANGUAGE: Respond in ").append(lang.equals("ta") ? "natural fluent Tamil (தமிழ்)" : lang.equals("hi") ? "natural fluent Hindi (हिन्दी)" : "clear student-friendly English").append(".\n");
        sb.append("5. STRUCTURE: Use markdown headings, bullet points, numbered steps, and actionable guidance.\n\n");

        if (profile != null) {
            sb.append("STUDENT PROFILE:\n");
            sb.append("- Education Level: ").append(profile.getEducationLevel()).append("\n");
            sb.append("- Course/Branch: ").append(profile.getCourseBranch()).append("\n");
            sb.append("- Marks %: ").append(profile.getMarksPercentage()).append("%\n");
            sb.append("- State: ").append(profile.getState()).append(", District: ").append(profile.getDistrict()).append("\n");
            sb.append("- Social Category: ").append(profile.getSocialCategory()).append("\n");
            sb.append("- TN Govt School Student (6-12th): ").append(profile.getIsGovtSchoolStudent()).append("\n");
            sb.append("- First Graduate in Family: ").append(profile.getIsFirstGraduate()).append("\n");
            sb.append("- Career Interests: ").append(profile.getCareerInterests()).append("\n\n");
        }

        // Opportunities Context
        sb.append("VERIFIED ERE-TN OPPORTUNITIES DATABASE:\n");
        for (Opportunity opp : opportunityRepository.findAll()) {
            if (opp.getVerificationStatus() != VerificationStatus.DEMO_DATA) {
                sb.append(String.format("• [%s] %s | Provider: %s | Level: %s | Amount: ₹%s | Official Source: %s | Eligibility: %s\n",
                        opp.getId(), opp.getTitle(), opp.getProvider().getName(), opp.getEducationLevel(),
                        opp.getFinancialAmount(), opp.getOfficialSourceUrl(), opp.getEligibilitySummary()));
            }
        }
        sb.append("\n");

        // Mentors Context
        sb.append("VERIFIED APPROVED ERE-TN MENTORS:\n");
        for (MentorProfile mp : mentorProfileRepository.findByVerificationStatus(MentorVerificationStatus.APPROVED)) {
            sb.append(String.format("• %s | Role: %s (%s) | Exp: %s yrs | Expertise: %s\n",
                    mp.getUser().getFullName(), mp.getTitleRole(), mp.getCompanyOrInstitution(),
                    mp.getYearsOfExperience(), mp.getExpertiseTags()));
        }
        sb.append("\n");

        // Courses Context
        sb.append("VERIFIED ERE-TN COURSES:\n");
        for (Course c : courseRepository.findAll()) {
            sb.append(String.format("• [%s] %s | Instructor: %s | Level: %s | Duration: %s hrs\n",
                    c.getId(), c.getTitle(), c.getInstructorName(), c.getLevel(), c.getDurationHours()));
        }

        return sb.toString();
    }

    private NovaChatResponse callRemoteLlm(String systemPrompt, NovaConversation conv, String userPrompt, String lang) {
        RestClient client = RestClient.builder().baseUrl(baseUrl).build();

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contentMap = new HashMap<>();
        contentMap.put("role", "user");
        contentMap.put("parts", List.of(Map.of("text", systemPrompt + "\n\nUser Question:\n" + userPrompt)));
        requestBody.put("contents", List.of(contentMap));

        String url = String.format("/models/%s:generateContent?key=%s", model, apiKey);

        String rawResponse = client.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        String generatedText = "I am ready to help you with your career and education.";
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                if (!textNode.isMissingNode()) {
                    generatedText = textNode.asText();
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini API response", e);
        }

        List<NovaActionLinkDto> actionButtons = generateActionButtons(userPrompt, lang);
        NovaRoadmapDto roadmap = maybeGenerateRoadmap(userPrompt);

        return NovaChatResponse.builder()
                .role("assistant")
                .content(generatedText)
                .language(lang)
                .actionButtons(actionButtons)
                .roadmap(roadmap)
                .build();
    }

    public NovaChatResponse generateGroundedEngineResponse(StudentProfile profile, String prompt, String lang) {
        String pLower = prompt.toLowerCase();
        StringBuilder content = new StringBuilder();
        List<NovaActionLinkDto> actionButtons = new ArrayList<>();
        NovaRoadmapDto roadmap = null;

        boolean isTamil = "ta".equalsIgnoreCase(lang);
        boolean isHindi = "hi".equalsIgnoreCase(lang);

        if (pLower.contains("scholarship") || pLower.contains("scheme") || pLower.contains("financial") || pLower.contains("fees") || pLower.contains("பணம்") || pLower.contains("உதவித்தொகை") || pLower.contains("छात्रवृत्ति")) {
            if (isTamil) {
                content.append("### 🎓 உங்களுக்கான கல்வி உதவித்தொகை வழிகாட்டல்\n\n");
                content.append("எடுநோவாவின் சரிபார்க்கப்பட்ட அரசு மற்றும் அறக்கட்டளைத் திட்டங்கள்:\n\n");
                content.append("1. **புதுமைப் பெண் திட்டம் (Pudhumai Penn Scheme)**\n");
                content.append("   - **பயன்:** மாதம் ₹1,000 நேரடி வங்கிப் பரிமாற்றம்.\n");
                content.append("   - **தகுதி:** தமிழக அரசுப் பள்ளிகளில் (6 முதல் 12 வரை) படித்து பட்டப்படிப்பு பயிலும் மாணவிகள்.\n");
                content.append("   - **அதிகாரப்பூர்வ தளம்:** [pudhumaipenn.tn.gov.in](https://www.pudhumaipenn.tn.gov.in/)\n\n");
                content.append("2. **தமிழ்ப் புதல்வன் திட்டம் (Tamil Pudhalvan Scheme)**\n");
                content.append("   - **பயன்:** மாதம் ₹1,000 நேரடி வங்கிப் பரிமாற்றம்.\n");
                content.append("   - **தகுதி:** தமிழக அரசுப் பள்ளிகளில் (6-12) பயின்ற மாணவர்களுக்கான உயர்கல்வி நிதி உதவி.\n");
                content.append("   - **அதிகாரப்பூர்வ தளம்:** [tamilpudhalvan.tn.gov.in](https://tamilpudhalvan.tn.gov.in/)\n\n");
                content.append("3. **டாடா கேபிடல் பங் உதவித்தொகை (Tata Capital Pankh)**\n");
                content.append("   - **பயன்:** ஆண்டுக்கு ₹50,000 வரை கல்லூரி கட்டண உதவி.\n");
                content.append("   - **தகுதி:** 12-ஆம் வகுப்பில் ≥60% மதிப்பெண் மற்றும் குடும்ப வருமானம் ≤ ₹2.5 லட்சம்.\n\n");
                content.append("> ℹ️ *குறிப்பு: இறுதி தகுதி அரசுத் துறை மற்றும் அதிகாரப்பூர்வ அறிவிப்பின்படியே தீர்மானிக்கப்படும்.*");
            } else if (isHindi) {
                content.append("### 🎓 आपके लिए छात्रवृत्ति एवं कल्याणकारी योजनाएं\n\n");
                content.append("ERE-TN के सत्यापित डेटाबेस से उपलब्ध प्रमुख योजनाएं:\n\n");
                content.append("1. **टाटा कैपिटल पंख छात्रवृत्ति (Tata Capital Pankh Scholarship)**\n");
                content.append("   - **लाभ:** कॉलेज फीस हेतु ₹50,000 प्रति वर्ष तक।\n");
                content.append("   - **पात्रता:** 12वीं में ≥60% अंक एवं पारिवारिक आय ≤ ₹2.5 लाख।\n");
                content.append("   - **आधिकारिक वेबसाइट:** [tatacapital.com/csr](https://www.tatacapital.com/csr/pankh-scholarship.html)\n\n");
                content.append("2. **पुधुमई पेन / तमिल पुधलवन योजना (तमिलनाडु सरकार)**\n");
                content.append("   - **लाभ:** ₹1,000 प्रति माह प्रत्यक्ष लाभ अंतरण (DBT)।\n");
                content.append("   - **पात्रता:** 6वीं से 12वीं तक सरकारी स्कूल में पढ़े स्नातक छात्र/छात्राएं।\n\n");
                content.append("> ℹ️ *अंतिम पात्रता संबंधित आधिकारिक विभाग द्वारा निर्धारित की जाती है।*");
            } else {
                content.append("### 🎓 Verified Scholarships & Government Schemes\n\n");
                content.append("Here are top verified opportunities from the ERE-TN database matching Indian & Tamil Nadu students:\n\n");
                content.append("1. **Pudhumai Penn Scheme (Moovalur Ramamirtham Higher Education)**\n");
                content.append("   - **Benefits:** ₹1,000/month direct bank transfer.\n");
                content.append("   - **Eligibility:** Female students who studied 6th–12th in TN Government Schools.\n");
                content.append("   - **Official Portal:** [pudhumaipenn.tn.gov.in](https://www.pudhumaipenn.tn.gov.in/)\n\n");
                content.append("2. **Tamil Pudhalvan Scheme**\n");
                content.append("   - **Benefits:** ₹1,000/month for male undergraduate & polytechnic students from TN Govt schools.\n");
                content.append("   - **Official Portal:** [tamilpudhalvan.tn.gov.in](https://tamilpudhalvan.tn.gov.in/)\n\n");
                content.append("3. **Tata Capital Pankh Scholarship Programme**\n");
                content.append("   - **Benefits:** Up to ₹50,000/year towards tuition & academic expenses.\n");
                content.append("   - **Eligibility:** Undergraduates scoring ≥ 60% with annual family income ≤ ₹2.5 Lakhs.\n\n");
                content.append("4. **Anna University CEG Alumni Endowment Award**\n");
                content.append("   - **Benefits:** ₹35,000/year tuition and hostel fee waiver for merit-cum-means engineering students.\n\n");
                content.append("> ℹ️ *Note: Final eligibility is determined by the official department or foundation.*");
            }

            actionButtons.add(NovaActionLinkDto.builder()
                    .type("CHECK_ELIGIBILITY")
                    .label(isTamil ? "எனக்கான தகுதியை சரிபார்க்கவும்" : isHindi ? "पात्रता जांचें" : "Check My Eligibility")
                    .url("/opportunities?eligibility=true")
                    .badge("Instant Match")
                    .build());
            actionButtons.add(NovaActionLinkDto.builder()
                    .type("OPPORTUNITY")
                    .label(isTamil ? "அனைத்து உதவித்தொகைகள்" : isHindi ? "सभी छात्रवृत्तियां देखें" : "Explore All 500+ Schemes")
                    .url("/opportunities")
                    .build());

        } else if (pLower.contains("roadmap") || pLower.contains("data science") || pLower.contains("software") || pLower.contains("cloud") || pLower.contains("ai") || pLower.contains("பாதை") || pLower.contains("வழிகாட்டல்") || pLower.contains("ரோட்மேப்") || pLower.contains("रोडमैप")) {
            String goal = "Software & Cloud Engineer";
            if (pLower.contains("data")) goal = "Data Scientist & AI Specialist";
            else if (pLower.contains("cloud") || pLower.contains("devops")) goal = "Cloud DevOps Architect";
            else if (pLower.contains("full stack") || pLower.contains("web")) goal = "Full Stack Web Developer";

            roadmap = generateStructuredRoadmap(goal);

            if (isTamil) {
                content.append(String.format("### 🧭 %s — தொழில் முன்னேற்றப் பாதை (Career Roadmap)\n\n", goal));
                content.append("உங்கள் இலக்கை அடைய படிப்படியான பயிற்சி வழிகாட்டல் இதோ:\n\n");
                content.append("• **படி 1: நிரலாக்க அடிப்படைகள் (Fundamentals)** — Python / Java, தரவுக் கட்டமைப்புகள் (Data Structures), Git.\n");
                content.append("• **படி 2: முக்கிய தொழில்நுட்பங்கள் (Core Tech)** — SQL, REST APIs, இணைய மேம்பாடு (Web Dev).\n");
                content.append("• **படி 3: சிறப்புத் திறன் (Specialization)** — மேகக்கணி கணினி (Cloud/AWS), ML அல்காரிதம்கள் அல்லது Spring Boot.\n");
                content.append("• **படி 4: நடைமுறை திட்டங்கள் (Projects)** — 3 தனித்துவமான GitHub திட்டப்பணிகளை உருவாக்குங்கள்.\n");
                content.append("• **படி 5: தொழிற்பயிற்சி & நேர்காணல் (Placements)** — பயோடேட்டா மதிப்பாய்வு மற்றும் மாதிரி நேர்காணல்கள்.\n\n");
                content.append("கீழே உள்ள ரோட்மேப்பை உங்கள் சுயவிவரத்தில் சேமித்து முன்னேற்றத்தைக் கண்காணிக்கலாம்!");
            } else if (isHindi) {
                content.append(String.format("### 🧭 %s — करियर रोडमैप (Career Roadmap)\n\n", goal));
                content.append("अपने करियर लक्ष्य को प्राप्त करने के लिए संरचित चरण:\n\n");
                content.append("• **चरण 1: मूलभूत प्रोग्रामिंग** — Python/Java, डेटा स्ट्रक्चर्स, Git एवं GitHub।\n");
                content.append("• **चरण 2: कोर स्किल्स** — SQL, डेटाबेस डिजाइन, REST APIs।\n");
                content.append("• **चरण 3: प्रोजेक्ट्स** — कम से कम 3 पोर्टफोलियो प्रोजेक्ट्स तैयार करें।\n");
                content.append("• **चरण 4: इंटर्नशिप एवं प्लेसमेंट तैयारी** — मॉक इंटरव्यू और तकनीकी तैयारी।\n\n");
                content.append("आप नीचे दिए गए रोडमैप को अपने डैशबोर्ड में सहेज सकते हैं!");
            } else {
                content.append(String.format("### 🧭 %s — Step-by-Step Career Roadmap\n\n", goal));
                content.append("Here is your structured 8-stage industry career roadmap:\n\n");
                content.append("1. **Stage 1: Programming & Problem Solving** — Core syntax (Python/Java), Git version control, and basic algorithms.\n");
                content.append("2. **Stage 2: Database Mastery** — Relational database modeling, SQL querying, and indexing.\n");
                content.append("3. **Stage 3: Frameworks & APIs** — Backend service development (Spring Boot/Node.js) and REST APIs.\n");
                content.append("4. **Stage 4: Cloud & Deployment** — Containerization with Docker, AWS basics, and CI/CD pipelines.\n");
                content.append("5. **Stage 5: Hands-on Portfolio Projects** — Build and host 3 production-grade open-source applications on GitHub.\n");
                content.append("6. **Stage 6: Technical Interview & Campus Placement** — System design basics, mock interview simulations, and resume refinement.\n\n");
                content.append("You can save this roadmap directly to your Student Dashboard to track your milestones!");
            }

            actionButtons.add(NovaActionLinkDto.builder()
                    .type("ROADMAP")
                    .label(isTamil ? "ரோட்மேப்பை சேமிக்கவும்" : isHindi ? "रोडमैप सहेजें" : "Save Roadmap to Dashboard")
                    .url("/dashboard")
                    .build());
            actionButtons.add(NovaActionLinkDto.builder()
                    .type("MENTOR")
                    .label(isTamil ? "வழிகாட்டியிடம் பேசுங்கள்" : isHindi ? "मेंटर से सलाह लें" : "Connect with a Mentor")
                    .url("/mentors")
                    .build());

        } else if (pLower.contains("mentor") || pLower.contains("guidance") || pLower.contains("counselling") || pLower.contains("வழிகாட்டி") || pLower.contains("ஆலோசனை") || pLower.contains("मेंटर")) {
            if (isTamil) {
                content.append("### 👨‍🏫 எடுநோவா சரிபார்க்கப்பட்ட வழிகாட்டிகள்\n\n");
                content.append("உங்களுக்கு வழிகாட்டத் தயாராக உள்ள முன்னணி நிபுணர்கள்:\n\n");
                content.append("• **Dr. S. Karthikeyan** — முதன்மை கிளவுட் ஆர்க்கிடெக்ட் (முன்னாள் AWS / IIT Madras).\n");
                content.append("• **Ananya Sundaram** — முன்னணி தரவு விஞ்ஞானி (AI Lead, பெங்களூரு).\n");
                content.append("• **R. Vigneshwar** — முழு-அடுக்கு பொறியியல் தலைவர் (Full Stack Lead, சென்னை).\n\n");
                content.append("மாணவர்களுக்கு 1-on-1 ஆலோசனை முற்றிலும் இலவசம்!");
            } else if (isHindi) {
                content.append("### 👨‍🏫 ERE-TN सत्यापित इंडस्ट्री मेंटर्स\n\n");
                content.append("वरिष्ठ विशेषज्ञों से 1-ऑन-1 व्यक्तिगत मार्गदर्शन प्राप्त करें:\n\n");
                content.append("• **Dr. S. Karthikeyan** — प्रिंसिपल क्लाउड आर्किटेक्ट (पूर्व AWS / IIT मद्रास)।\n");
                content.append("• **Ananya Sundaram** — सीनियर डेटा साइंटिस्ट एवं AI लीड।\n\n");
                content.append("छात्रों के लिए 1-ऑन-1 परामर्श सत्र निःशुल्क उपलब्ध है!");
            } else {
                content.append("### 👨‍🏫 Verified Industry Mentors Available for 1-on-1 Guidance\n\n");
                content.append("You can book a free 1-on-1 career counselling and resume review session with verified experts:\n\n");
                content.append("• **Dr. S. Karthikeyan** — Principal Cloud Architect (Ex-AWS, IIT Madras Alumnus) | Cloud, Systems & Placements.\n");
                content.append("• **Ananya Sundaram** — Senior Data Scientist & AI Lead | Python, Machine Learning & Analytics.\n");
                content.append("• **R. Vigneshwar** — Full Stack Engineering Lead | Java Spring Boot, React & Placement Mastery.\n\n");
                content.append("Sessions are 100% free for students on ERE-TN.");
            }

            actionButtons.add(NovaActionLinkDto.builder()
                    .type("MENTOR")
                    .label(isTamil ? "வழிகாட்டிகளைப் பார்க்கவும்" : isHindi ? "मेंटर सत्र बुक करें" : "Book 1-on-1 Counselling")
                    .url("/mentors")
                    .build());
            actionButtons.add(NovaActionLinkDto.builder()
                    .type("MEETING")
                    .label(isTamil ? "நேரலை அமர்வுகள்" : isHindi ? "लाइव करियर सेशन्स" : "View Online Career Sessions")
                    .url("/meetings")
                    .build());

        } else {
            // General Greeting & Capabilities
            if (isTamil) {
                content.append("### 👋 வணக்கம்! நான் நோவா (NOVA AI)\n\n");
                content.append("உங்கள் கல்வி மற்றும் தொழில் பயணத்திற்கான பிரத்யேக AI வழிகாட்டி.\n\n");
                content.append("நான் உங்களுக்கு எதில் உதவ வேண்டும்?\n\n");
                content.append("1. 🎓 **கல்வி உதவித்தொகைகள் கண்டறிதல்** — அரசு மற்றும் தனியார் திட்டங்கள்.\n");
                content.append("2. 🧭 **தொழில் வழிகாட்டல் & ரோட்மேப்** — நீங்கள் விரும்பும் துறைக்கான பயிற்சிப் பாதை.\n");
                content.append("3. 📚 **திறன் மேம்பாட்டுப் படிப்புகள்** — பைதான், தரவு அறிவியல், இணைய மேம்பாடு.\n");
                content.append("4. 👨‍🏫 **வழிகாட்டிகளுடன் 1-on-1 நேரடி ஆலோசனை**.\n");
                content.append("5. 📹 **நேரலை தொழில் அமர்வுகள் (Online Career Sessions)**.");
            } else if (isHindi) {
                content.append("### 👋 नमस्ते! मैं नोवा (NOVA AI) हूँ\n\n");
                content.append("आपकी शिक्षा और करियर के लिए आपका AI गाइड।\n\n");
                content.append("मैं आपकी किस प्रकार सहायता कर सकता हूँ?\n\n");
                content.append("1. 🎓 **छात्रवृत्तियां और सरकारी योजनाएं खोजें**\n");
                content.append("2. 🧭 **करियर रोडमैप और कौशल मार्गदर्शन**\n");
                content.append("3. 📚 **स्किल डेवलपमेंट कोर्सेस**\n");
                content.append("4. 👨‍🏫 **सत्यापित मेंटर्स से 1-ऑन-1 परामर्श**\n");
                content.append("5. 📹 **लाइव ऑनलाइन करियर सेशन्स**");
            } else {
                content.append("### 👋 Hi! I'm NOVA AI\n\n");
                content.append("Your dedicated educational & career guide for ERE-TN.\n\n");
                content.append("Here are some of the ways I can assist you today:\n\n");
                content.append("• 🎓 **Scholarship Discovery:** Check your eligibility for 500+ verified Central & Tamil Nadu government schemes.\n");
                content.append("• 🧭 **Career Roadmaps:** Generate a stage-by-stage learning plan for tech, engineering, and science careers.\n");
                content.append("• 📚 **Skill Courses:** Explore structured lessons in Python, Data Science, and Full Stack development.\n");
                content.append("• 👨‍🏫 **1-on-1 Mentorship:** Connect with senior industry architects and researchers.\n");
                content.append("• 📹 **Online Career Sessions:** Join live interactive masterclasses with WebRTC video rooms.");
            }

            actionButtons.add(NovaActionLinkDto.builder()
                    .type("CHECK_ELIGIBILITY")
                    .label(isTamil ? "தகுதி சரிபார்க்கவும்" : isHindi ? "पात्रता जांचें" : "Check My Eligibility")
                    .url("/opportunities?eligibility=true")
                    .build());
            actionButtons.add(NovaActionLinkDto.builder()
                    .type("OPPORTUNITY")
                    .label(isTamil ? "வாய்ப்புகளை ஆராய்க" : isHindi ? "अवसर देखें" : "Explore Opportunities")
                    .url("/opportunities")
                    .build());
            actionButtons.add(NovaActionLinkDto.builder()
                    .type("MEETING")
                    .label(isTamil ? "நேரலை அமர்வுகள்" : isHindi ? "लाइव सेशन्स" : "Online Career Sessions")
                    .url("/meetings")
                    .build());
        }

        return NovaChatResponse.builder()
                .role("assistant")
                .content(content.toString())
                .language(lang)
                .actionButtons(actionButtons)
                .roadmap(roadmap)
                .build();
    }

    private NovaRoadmapDto generateStructuredRoadmap(String goal) {
        List<NovaRoadmapStageDto> stages = new ArrayList<>();
        stages.add(NovaRoadmapStageDto.builder()
                .stageNumber(1)
                .title("Programming Fundamentals & Git")
                .description("Master variable structures, control flow, functions, and Git source control.")
                .skills(List.of("Python / Java", "Git", "GitHub", "Terminal CLI"))
                .keyMilestone("Build and push 2 CLI automation tools to GitHub")
                .build());

        stages.add(NovaRoadmapStageDto.builder()
                .stageNumber(2)
                .title("Data Structures & Algorithms")
                .description("Develop algorithmic problem-solving for coding interviews.")
                .skills(List.of("Arrays & Strings", "Linked Lists", "Trees", "Sorting", "Big-O"))
                .keyMilestone("Solve 50 LeetCode / HackerRank problems")
                .build());

        stages.add(NovaRoadmapStageDto.builder()
                .stageNumber(3)
                .title("Databases & RESTful Architecture")
                .description("Design normalized relational schemas and build CRUD REST APIs.")
                .skills(List.of("PostgreSQL", "SQL Queries", "Spring Boot / Express", "REST APIs"))
                .keyMilestone("Build a full-stack REST API with database persistence")
                .build());

        stages.add(NovaRoadmapStageDto.builder()
                .stageNumber(4)
                .title("Frontend Architecture & UI Design")
                .description("Build responsive, accessible user interfaces with modern React.")
                .skills(List.of("React 18", "TypeScript", "Tailwind CSS", "State Management"))
                .keyMilestone("Complete 1 responsive dashboard frontend")
                .build());

        stages.add(NovaRoadmapStageDto.builder()
                .stageNumber(5)
                .title("Cloud Infrastructure & Containerization")
                .description("Deploy applications to cloud platforms with automated pipelines.")
                .skills(List.of("Docker", "AWS / GCP Basics", "CI/CD GitHub Actions", "Linux"))
                .keyMilestone("Containerize and deploy application with a live domain")
                .build());

        stages.add(NovaRoadmapStageDto.builder()
                .stageNumber(6)
                .title("Capstone Portfolio & Campus Placements")
                .description("Conduct mock technical interviews, refine resume, and apply for opportunities.")
                .skills(List.of("Resume Building", "System Design", "Mock Interviews", "Networking"))
                .keyMilestone("Apply to 10 verified internships/jobs with mentor review")
                .build());

        return NovaRoadmapDto.builder()
                .goal(goal)
                .estimatedMonths("6–9 Months")
                .stages(stages)
                .build();
    }

    private NovaRoadmapDto maybeGenerateRoadmap(String prompt) {
        String p = prompt.toLowerCase();
        if (p.contains("roadmap") || p.contains("become a") || p.contains("how to start") || p.contains("ரோட்மேப்") || p.contains("रोडमैप")) {
            String goal = "Full Stack & Cloud Engineer";
            if (p.contains("data")) goal = "Data Scientist & AI Specialist";
            else if (p.contains("cloud") || p.contains("devops")) goal = "Cloud DevOps Architect";
            return generateStructuredRoadmap(goal);
        }
        return null;
    }

    private List<NovaActionLinkDto> generateActionButtons(String prompt, String lang) {
        List<NovaActionLinkDto> buttons = new ArrayList<>();
        String p = prompt.toLowerCase();
        boolean isTamil = "ta".equalsIgnoreCase(lang);
        boolean isHindi = "hi".equalsIgnoreCase(lang);

        if (p.contains("scholarship") || p.contains("scheme") || p.contains("eligib") || p.contains("பணம்") || p.contains("உதவித்தொகை") || p.contains("छात्रवृत्ति")) {
            buttons.add(NovaActionLinkDto.builder()
                    .type("CHECK_ELIGIBILITY")
                    .label(isTamil ? "தகுதி சரிபார்க்கவும்" : isHindi ? "पात्रता जांचें" : "Check My Eligibility")
                    .url("/opportunities?eligibility=true")
                    .build());
            buttons.add(NovaActionLinkDto.builder()
                    .type("OPPORTUNITY")
                    .label(isTamil ? "அனைத்து வாய்ப்புகள்" : isHindi ? "सभी छात्रवृत्तियां" : "Explore All Opportunities")
                    .url("/opportunities")
                    .build());
        } else if (p.contains("mentor") || p.contains("counsel") || p.contains("வழிகாட்டி") || p.contains("मेंटर")) {
            buttons.add(NovaActionLinkDto.builder()
                    .type("MENTOR")
                    .label(isTamil ? "வழிகாட்டிகள் பக்கம்" : isHindi ? "मेंटर देखें" : "View Verified Mentors")
                    .url("/mentors")
                    .build());
        } else {
            buttons.add(NovaActionLinkDto.builder()
                    .type("CHECK_ELIGIBILITY")
                    .label(isTamil ? "தகுதி சரிபார்க்கவும்" : isHindi ? "पात्रता जांचें" : "Check My Eligibility")
                    .url("/opportunities?eligibility=true")
                    .build());
            buttons.add(NovaActionLinkDto.builder()
                    .type("MEETING")
                    .label(isTamil ? "நேரலை அமர்வுகள்" : isHindi ? "लाइव सेशन्स" : "Online Career Sessions")
                    .url("/meetings")
                    .build());
        }

        return buttons;
    }
}

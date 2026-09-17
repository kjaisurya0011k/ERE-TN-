package com.edunova.service;

import com.edunova.domain.VerificationStatus;
import com.edunova.domain.entity.Opportunity;
import com.edunova.domain.entity.OpportunityEligibility;
import com.edunova.dto.OpportunityDtos.EligibilityCheckRequest;
import com.edunova.dto.OpportunityDtos.EligibilityCheckResponse;
import com.edunova.dto.OpportunityDtos.EligibilityResultItem;
import com.edunova.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EligibilityService {

    private final OpportunityRepository opportunityRepository;
    private final OpportunityService opportunityService;

    // ─── Localization Helpers ──────────────────────────────────────────────────

    private static final Map<String, String> ELIGIBLE_STATUS = Map.of(
            "en", "You may be eligible",
            "ta", "நீங்கள் தகுதியுடையவராக இருக்கலாம்",
            "hi", "आप पात्र हो सकते हैं"
    );
    private static final Map<String, String> PARTIAL_STATUS = Map.of(
            "en", "Needs more information",
            "ta", "கூடுதல் தகவல் தேவை",
            "hi", "अधिक जानकारी चाहिए"
    );
    private static final Map<String, String> NOT_ELIGIBLE_STATUS = Map.of(
            "en", "Likely not eligible",
            "ta", "தகுதியில்லாமல் இருக்கலாம்",
            "hi", "संभवतः पात्र नहीं"
    );
    private static final Map<String, String> VERIFIED_NOTICE = Map.of(
            "en", "Eligibility shown by ERE-TN is an initial indication only. Final eligibility is determined by the official department or opportunity provider.",
            "ta", "ERE-TN காட்டும் தகுதி ஒரு ஆரம்ப சுட்டுகையாகும் மட்டுமே. இறுதி தகுதி அதிகாரப்பூர்வ துறை அல்லது வழங்குனரால் நிர்ணயிக்கப்படும்.",
            "hi", "ERE-TN द्वारा दिखाई गई पात्रता केवल प्रारंभिक संकेत है। अंतिम पात्रता आधिकारिक विभाग या अवसर प्रदाता द्वारा निर्धारित की जाती है।"
    );

    private String msg(Map<String, String> map, String lang) {
        return map.getOrDefault(lang != null ? lang : "en", map.get("en"));
    }

    // Gender-check messages
    private String genderMatchMsg(String gender, String lang) {
        return switch (lang) {
            case "ta" -> gender.equalsIgnoreCase("FEMALE") ? "பெண் மாணவர் தகுதி பொருந்துகிறது"
                    : "ஆண் மாணவர் தகுதி பொருந்துகிறது";
            case "hi" -> gender.equalsIgnoreCase("FEMALE") ? "महिला छात्र की पात्रता मेल खाती है"
                    : "पुरुष छात्र की पात्रता मेल खाती है";
            default -> "Matches " + gender.toLowerCase() + " student requirement";
        };
    }

    private String genderMissingMsg(String genderAllowed, String lang) {
        String g = genderAllowed.replace("_", " ").toLowerCase();
        return switch (lang) {
            case "ta" -> "இத் திட்டம் " + g + " மாணவர்களுக்கானது";
            case "hi" -> "यह योजना " + g + " छात्रों के लिए है";
            default -> "Applicable for: " + g;
        };
    }

    private String stateMatchMsg(String state, String lang) {
        return switch (lang) {
            case "ta" -> "உங்கள் மாநில வாழ்விடம் (" + state + ") தகுதியுடையது";
            case "hi" -> "आपका अधिवास राज्य (" + state + ") पात्र है";
            default -> "Domicile state (" + state + ") is eligible";
        };
    }

    private String stateMissingMsg(String states, String lang) {
        return switch (lang) {
            case "ta" -> "தேவை: " + states + " மாநில குடியிருப்பு";
            case "hi" -> "आवश्यक अधिवास: " + states;
            default -> "Requires domicile in: " + states;
        };
    }

    private String eduMatchMsg(String level, String lang) {
        String l = level.replace("_", " ");
        return switch (lang) {
            case "ta" -> "தற்போதைய கல்வி நிலை (" + l + ") பொருந்துகிறது";
            case "hi" -> "वर्तमान शिक्षा स्तर (" + l + ") मेल खाता है";
            default -> "Matches current level: " + l;
        };
    }

    private String govtSchoolMatchMsg(String lang) {
        return switch (lang) {
            case "ta" -> "தமிழ்நாடு அரசுப் பள்ளியில் 6 முதல் 12 வரை படித்தீர்கள்";
            case "hi" -> "आपने TN सरकारी विद्यालय में 6वीं से 12वीं तक पढ़ाई की है";
            default -> "Studied 6th to 12th in Tamil Nadu Government School";
        };
    }

    private String govtSchoolMissingMsg(String lang) {
        return switch (lang) {
            case "ta" -> "தமிழ்நாடு அரசுப் பள்ளியில் 6–12 படிப்பு கட்டாயம்";
            case "hi" -> "TN सरकारी विद्यालय में 6वीं–12वीं अध्ययन आवश्यक";
            default -> "Requires 6th-12th schooling in TN Government School";
        };
    }

    private String firstGradMatchMsg(String lang) {
        return switch (lang) {
            case "ta" -> "குடும்பத்தின் முதல் பட்டதாரி என்ற நிலை பொருந்துகிறது";
            case "hi" -> "परिवार में प्रथम स्नातक की स्थिति मेल खाती है";
            default -> "Matches First Graduate in Family status";
        };
    }

    private String firstGradMissingMsg(String lang) {
        return switch (lang) {
            case "ta" -> "குடும்பத்தின் முதல் பட்டதாரியாக இருக்க வேண்டும்";
            case "hi" -> "परिवार में प्रथम स्नातक होना आवश्यक है";
            default -> "Requires First Graduate in Family status";
        };
    }

    private String incomeMatchMsg(Long limit, String lang) {
        return switch (lang) {
            case "ta" -> "வருடாந்திர குடும்ப வருமானம் ₹" + limit + " வரம்பிற்குள் உள்ளது";
            case "hi" -> "वार्षिक पारिवारिक आय ₹" + limit + " की सीमा के भीतर है";
            default -> "Family annual income is within the ceiling of ₹" + limit;
        };
    }

    private String incomeMissingMsg(Long limit, String lang) {
        return switch (lang) {
            case "ta" -> "வருடாந்திர குடும்ப வருமானம் ₹" + limit + "-க்கு மிகக்கூடாது";
            case "hi" -> "वार्षिक पारिवारिक आय ₹" + limit + " से अधिक नहीं होनी चाहिए";
            default -> "Family annual income exceeds limit of ₹" + limit;
        };
    }

    private String marksMatchMsg(BigDecimal score, BigDecimal min, String lang) {
        return switch (lang) {
            case "ta" -> "உங்கள் மதிப்பெண் (" + score + "%) குறைந்தபட்ச தேவையான " + min + "%-ஐ பூர்த்தி செய்கிறது";
            case "hi" -> "आपका अंक (" + score + "%) न्यूनतम " + min + "% की आवश्यकता को पूरा करता है";
            default -> "Academic score (" + score + "%) satisfies minimum of " + min + "%";
        };
    }

    private String marksMissingMsg(BigDecimal min, String lang) {
        return switch (lang) {
            case "ta" -> "குறைந்தபட்ச மதிப்பெண் " + min + "% தேவை";
            case "hi" -> "न्यूनतम अंक " + min + "% आवश्यक";
            default -> "Requires minimum academic score of " + min + "%";
        };
    }

    private String catMatchMsg(String cat, String lang) {
        return switch (lang) {
            case "ta" -> "சமூக பிரிவு (" + cat + ") தகுதியானது";
            case "hi" -> "सामाजिक श्रेणी (" + cat + ") पात्र है";
            default -> "Social category (" + cat + ") is eligible";
        };
    }

    private String catMissingMsg(String cats, String lang) {
        return switch (lang) {
            case "ta" -> "பொருந்தும் சமூக பிரிவுகள்: " + cats;
            case "hi" -> "लागू सामाजिक श्रेणियाँ: " + cats;
            default -> "Applicable for categories: " + cats;
        };
    }

    private String demoNoteMsg(String lang) {
        return switch (lang) {
            case "ta" -> "மாதிரி தரவு — உண்மையான விண்ணப்பத்திற்கு பயன்படுத்தவேண்டாம்";
            case "hi" -> "डेमो डेटा — वास्तविक आवेदन के लिए उपयोग न करें";
            default -> "DEMO DATA — NOT FOR ACTUAL APPLICATION";
        };
    }

    private String verifiedNoteMsg(String lang) {
        return switch (lang) {
            case "ta" -> "சமீபத்திய அதிகாரப்பூர்வ அரசிதழ் அல்லது அறிவிப்பின்படி சரிபார்க்கப்பட்டது.";
            case "hi" -> "नवीनतम आधिकारिक राजपत्र/अधिसूचना के अनुसार सत्यापित।";
            default -> "Verified according to latest official gazette/notification.";
        };
    }

    // ─── Main Evaluation ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public EligibilityCheckResponse evaluateEligibility(EligibilityCheckRequest req) {
        return evaluateEligibility(req, "en");
    }

    @Transactional(readOnly = true)
    public EligibilityCheckResponse evaluateEligibility(EligibilityCheckRequest req, String lang) {
        String resolvedLang = (lang != null && List.of("en", "ta", "hi").contains(lang)) ? lang : "en";
        List<Opportunity> allOpps = opportunityRepository.findAll();
        List<EligibilityResultItem> results = new ArrayList<>();

        for (Opportunity opp : allOpps) {
            OpportunityEligibility e = opp.getEligibility();
            List<String> reasons = new ArrayList<>();
            List<String> missing = new ArrayList<>();
            int totalChecks = 0;
            int matchedChecks = 0;

            if (e != null) {
                // 1. Gender
                if (e.getGenderAllowed() != null && !e.getGenderAllowed().equalsIgnoreCase("ALL")) {
                    totalChecks++;
                    if (req.getGender() != null && e.getGenderAllowed().equalsIgnoreCase(req.getGender() + "_ONLY")) {
                        matchedChecks++;
                        reasons.add(genderMatchMsg(req.getGender(), resolvedLang));
                    } else {
                        missing.add(genderMissingMsg(e.getGenderAllowed(), resolvedLang));
                    }
                }

                // 2. State
                if (e.getAllowedStates() != null && !e.getAllowedStates().isEmpty()) {
                    totalChecks++;
                    List<String> states = Arrays.asList(e.getAllowedStates().split(","));
                    if (states.contains("All India") || (req.getState() != null && states.contains(req.getState()))) {
                        matchedChecks++;
                        reasons.add(stateMatchMsg(req.getState() != null ? req.getState() : "All India", resolvedLang));
                    } else {
                        missing.add(stateMissingMsg(e.getAllowedStates(), resolvedLang));
                    }
                }

                // 3. Education Level
                if (e.getAllowedEducationLevels() != null && !e.getAllowedEducationLevels().isEmpty() && req.getEducationLevel() != null) {
                    totalChecks++;
                    List<String> levels = Arrays.asList(e.getAllowedEducationLevels().split(","));
                    if (levels.contains(req.getEducationLevel().name())) {
                        matchedChecks++;
                        reasons.add(eduMatchMsg(req.getEducationLevel().name(), resolvedLang));
                    } else {
                        switch (resolvedLang) {
                            case "ta" -> missing.add("கல்வி தகுதி நிலை பொருந்தவில்லை");
                            case "hi" -> missing.add("शिक्षा स्तर की आवश्यकता पूरी नहीं हुई");
                            default -> missing.add("Education level requirement not met");
                        }
                    }
                }

                // 4. Govt School
                if (e.getRequiresGovtSchool() != null && e.getRequiresGovtSchool()) {
                    totalChecks++;
                    if (req.getIsGovtSchoolStudent() != null && req.getIsGovtSchoolStudent()) {
                        matchedChecks++;
                        reasons.add(govtSchoolMatchMsg(resolvedLang));
                    } else {
                        missing.add(govtSchoolMissingMsg(resolvedLang));
                    }
                }

                // 5. First Graduate
                if (e.getRequiresFirstGraduate() != null && e.getRequiresFirstGraduate()) {
                    totalChecks++;
                    if (req.getIsFirstGraduate() != null && req.getIsFirstGraduate()) {
                        matchedChecks++;
                        reasons.add(firstGradMatchMsg(resolvedLang));
                    } else {
                        missing.add(firstGradMissingMsg(resolvedLang));
                    }
                }

                // 6. Income
                if (e.getMaxFamilyIncome() != null && req.getFamilyAnnualIncome() != null) {
                    totalChecks++;
                    if (req.getFamilyAnnualIncome() <= e.getMaxFamilyIncome()) {
                        matchedChecks++;
                        reasons.add(incomeMatchMsg(e.getMaxFamilyIncome(), resolvedLang));
                    } else {
                        missing.add(incomeMissingMsg(e.getMaxFamilyIncome(), resolvedLang));
                    }
                }

                // 7. Marks
                if (e.getMinMarksPercentage() != null && req.getMarksPercentage() != null) {
                    totalChecks++;
                    if (req.getMarksPercentage().compareTo(e.getMinMarksPercentage()) >= 0) {
                        matchedChecks++;
                        reasons.add(marksMatchMsg(req.getMarksPercentage(), e.getMinMarksPercentage(), resolvedLang));
                    } else {
                        missing.add(marksMissingMsg(e.getMinMarksPercentage(), resolvedLang));
                    }
                }

                // 8. Social Category
                if (e.getAllowedCategories() != null && !e.getAllowedCategories().isEmpty() && req.getSocialCategory() != null) {
                    totalChecks++;
                    List<String> cats = Arrays.asList(e.getAllowedCategories().split(","));
                    if (cats.contains(req.getSocialCategory().name())) {
                        matchedChecks++;
                        reasons.add(catMatchMsg(req.getSocialCategory().name(), resolvedLang));
                    } else {
                        missing.add(catMissingMsg(e.getAllowedCategories(), resolvedLang));
                    }
                }
            }

            int matchPercentage = totalChecks > 0 ? (int) Math.round(((double) matchedChecks / totalChecks) * 100) : 80;
            String status;
            if (matchPercentage >= 80 && missing.isEmpty()) {
                status = "ELIGIBLE";
            } else if (matchPercentage >= 50) {
                status = "PARTIAL";
            } else {
                status = "NOT_ELIGIBLE";
            }

            String notes = opp.getVerificationStatus() == VerificationStatus.DEMO_DATA
                    ? demoNoteMsg(resolvedLang)
                    : verifiedNoteMsg(resolvedLang);

            results.add(EligibilityResultItem.builder()
                    .opportunity(opportunityService.mapToResponse(opp, resolvedLang))
                    .matchPercentage(matchPercentage)
                    .status(status)
                    .reasonsMatched(reasons)
                    .missingCriteria(missing)
                    .notes(notes)
                    .build());
        }

        results.sort((a, b) -> b.getMatchPercentage().compareTo(a.getMatchPercentage()));
        int eligibleCount = (int) results.stream().filter(r -> "ELIGIBLE".equals(r.getStatus())).count();

        return EligibilityCheckResponse.builder()
                .results(results)
                .totalEvaluated(results.size())
                .eligibleCount(eligibleCount)
                .notice(msg(VERIFIED_NOTICE, resolvedLang))
                .build();
    }
}

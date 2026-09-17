package com.edunova.service;

import com.edunova.domain.OpportunityType;
import com.edunova.domain.VerificationStatus;
import com.edunova.domain.entity.*;
import com.edunova.dto.OpportunityDtos.*;
import com.edunova.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final ProviderRepository providerRepository;
    private final InstitutionRepository institutionRepository;
    private final StudentProfileRepository studentProfileRepository;

    // ─── Public API ────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OpportunityResponse> getAllOpportunities(String query, OpportunityType type, String state,
                                                         VerificationStatus verification, String lang) {
        return opportunityRepository.searchAndFilter(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                type,
                (state != null && !state.equals("ALL")) ? state : null,
                verification
        ).stream().map(opp -> mapToResponse(opp, lang)).collect(Collectors.toList());
    }

    /** Backward-compatible overload (defaults to English) */
    @Transactional(readOnly = true)
    public List<OpportunityResponse> getAllOpportunities(String query, OpportunityType type, String state,
                                                         VerificationStatus verification) {
        return getAllOpportunities(query, type, state, verification, "en");
    }

    @Transactional(readOnly = true)
    public OpportunityResponse getOpportunityById(String id, String lang) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Opportunity not found with ID: " + id));
        return mapToResponse(opp, lang);
    }

    @Transactional(readOnly = true)
    public OpportunityResponse getOpportunityById(String id) {
        return getOpportunityById(id, "en");
    }

    @Transactional(readOnly = true)
    public List<OpportunityResponse> getRecommendedOpportunities(UUID userId, String lang) {
        var profileOpt = studentProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            return opportunityRepository.findByFeaturedTrue().stream()
                    .map(opp -> mapToResponse(opp, lang)).collect(Collectors.toList());
        }

        StudentProfile profile = profileOpt.get();
        return opportunityRepository.findAll().stream()
                .filter(opp -> isRecommendedFor(opp, profile))
                .map(opp -> mapToResponse(opp, lang))
                .limit(6)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OpportunityResponse> getRecommendedOpportunities(UUID userId) {
        return getRecommendedOpportunities(userId, "en");
    }

    // ─── Create / Update / Delete ──────────────────────────────────────────────

    @Transactional
    public OpportunityResponse createOpportunity(OpportunityCreateRequest req) {
        Provider provider = providerRepository.findById(req.getProviderId())
                .orElseGet(() -> providerRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("No provider found")));

        String id = "opp-" + UUID.randomUUID().toString().substring(0, 8);
        Opportunity opp = Opportunity.builder()
                .id(id)
                .title(req.getTitle())
                .description(req.getDescription() != null ? req.getDescription() : req.getTitle())
                .opportunityType(req.getType() != null ? req.getType() : OpportunityType.GOVERNMENT_SCHOLARSHIP)
                .governmentLevel(req.getGovernmentLevel())
                .provider(provider)
                .state(req.getState() != null ? req.getState() : "All India")
                .educationLevel(req.getEducationLevel())
                .eligibilitySummary(req.getEligibilitySummary())
                .benefitsDescription(req.getBenefitsDescription())
                .financialAmount(req.getFinancialAmount())
                .officialSourceUrl(req.getOfficialInfoUrl())
                .officialApplicationUrl(req.getOfficialApplyUrl())
                .verificationStatus(req.getVerificationStatus() != null ? req.getVerificationStatus() : VerificationStatus.VERIFIED)
                .lastVerifiedDate(LocalDate.now())
                .featured(false)
                .tags(req.getCategoryTags() != null ? new HashSet<>(req.getCategoryTags()) : new HashSet<>())
                .build();

        if (req.getCriteria() != null) {
            OpportunityCriteriaDto c = req.getCriteria();
            OpportunityEligibility elig = OpportunityEligibility.builder()
                    .opportunity(opp)
                    .minAge(c.getMinAge())
                    .maxAge(c.getMaxAge())
                    .genderAllowed(c.getGenderAllowed())
                    .allowedStates(c.getAllowedStates() != null ? String.join(",", c.getAllowedStates()) : null)
                    .allowedEducationLevels(c.getAllowedEducationLevels() != null ? String.join(",", c.getAllowedEducationLevels()) : null)
                    .allowedCourses(c.getAllowedCourses() != null ? String.join(",", c.getAllowedCourses()) : null)
                    .minMarksPercentage(c.getMinMarksPercentage())
                    .maxFamilyIncome(c.getMaxFamilyIncome())
                    .allowedCategories(c.getAllowedCategories() != null ? String.join(",", c.getAllowedCategories()) : null)
                    .requiresGovtSchool(c.getRequiresGovtSchool())
                    .requiresFirstGraduate(c.getRequiresFirstGraduate())
                    .requiresPwd(c.getRequiresPwd())
                    .requiresHosteller(c.getRequiresHosteller())
                    .allowedInstitutions(c.getAllowedInstitutions() != null ? String.join(",", c.getAllowedInstitutions()) : null)
                    .otherConditions(c.getSpecialNotes())
                    .build();
            opp.setEligibility(elig);
        }

        if (req.getRequiredDocuments() != null) {
            int order = 1;
            for (String docName : req.getRequiredDocuments()) {
                opp.getDocuments().add(OpportunityDocument.builder()
                        .opportunity(opp)
                        .name(docName)
                        .description("Mandatory verification certificate")
                        .required(true)
                        .sortOrder(order++)
                        .build());
            }
        }

        if (req.getApplicationProcess() != null) {
            int stepNum = 1;
            for (String stepStr : req.getApplicationProcess()) {
                opp.getApplicationSteps().add(OpportunityApplicationStep.builder()
                        .opportunity(opp)
                        .stepNumber(stepNum++)
                        .instruction(stepStr)
                        .build());
            }
        }

        Opportunity saved = opportunityRepository.save(opp);
        return mapToResponse(saved, "en");
    }

    @Transactional
    public OpportunityResponse updateOpportunity(String id, OpportunityUpdateRequest req) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Opportunity not found with ID: " + id));

        if (req.getTitle() != null) opp.setTitle(req.getTitle());
        if (req.getDescription() != null) opp.setDescription(req.getDescription());
        if (req.getType() != null) opp.setOpportunityType(req.getType());
        if (req.getGovernmentLevel() != null) opp.setGovernmentLevel(req.getGovernmentLevel());
        if (req.getState() != null) opp.setState(req.getState());
        if (req.getEducationLevel() != null) opp.setEducationLevel(req.getEducationLevel());
        if (req.getEligibilitySummary() != null) opp.setEligibilitySummary(req.getEligibilitySummary());
        if (req.getBenefitsDescription() != null) opp.setBenefitsDescription(req.getBenefitsDescription());
        if (req.getFinancialAmount() != null) opp.setFinancialAmount(req.getFinancialAmount());
        if (req.getOfficialInfoUrl() != null) opp.setOfficialSourceUrl(req.getOfficialInfoUrl());
        if (req.getOfficialApplyUrl() != null) opp.setOfficialApplicationUrl(req.getOfficialApplyUrl());
        if (req.getVerificationStatus() != null) opp.setVerificationStatus(req.getVerificationStatus());
        opp.setLastVerifiedDate(LocalDate.now());

        if (req.getProviderId() != null) {
            providerRepository.findById(req.getProviderId()).ifPresent(opp::setProvider);
        }
        if (req.getCategoryTags() != null) {
            opp.setTags(new HashSet<>(req.getCategoryTags()));
        }

        Opportunity saved = opportunityRepository.save(opp);
        return mapToResponse(saved, "en");
    }

    @Transactional
    public OpportunityResponse updateVerificationStatus(String id, VerificationStatus status) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Opportunity not found with ID: " + id));
        opp.setVerificationStatus(status);
        opp.setLastVerifiedDate(LocalDate.now());
        return mapToResponse(opportunityRepository.save(opp), "en");
    }

    @Transactional
    public void deleteOpportunity(String id) {
        if (!opportunityRepository.existsById(id)) {
            throw new IllegalArgumentException("Opportunity not found with ID: " + id);
        }
        opportunityRepository.deleteById(id);
    }

    // ─── Providers & Institutions ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ProviderDto> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(this::mapToProviderDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProviderDto getProviderById(String id) {
        Provider p = providerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found: " + id));
        return mapToProviderDto(p);
    }

    @Transactional(readOnly = true)
    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }

    // ─── Mapping Helpers ───────────────────────────────────────────────────────

    public ProviderDto mapToProviderDto(Provider p) {
        return ProviderDto.builder()
                .id(p.getId())
                .name(p.getName())
                .type(p.getType())
                .providerCategory(p.getProviderCategory())
                .description(p.getDescription())
                .mission(p.getMission())
                .whoTheySupport(p.getWhoTheySupport())
                .logoUrl(p.getLogoUrl())
                .officialWebsite(p.getOfficialWebsite())
                .officialWebsiteUrl(p.getOfficialWebsiteUrl())
                .scholarshipPageUrl(p.getScholarshipPageUrl())
                .admissionPageUrl(p.getAdmissionPageUrl())
                .contactEmail(p.getContactEmail())
                .contactPhone(p.getContactPhone())
                .location(p.getLocation())
                .state(p.getState())
                .verificationStatus(p.getVerificationStatus())
                .lastVerifiedDate(p.getLastVerifiedDate())
                .focusAreas(new ArrayList<>(p.getFocusAreas()))
                .build();
    }

    /**
     * Maps an Opportunity entity to an OpportunityResponse DTO.
     * Resolved language content is returned in the top-level fields;
     * all available translations are also embedded in the `translations` map.
     * Full TamilNaduScholarshipMasterSchema structure is included.
     */
    public OpportunityResponse mapToResponse(Opportunity opp, String lang) {
        String resolvedLang = (lang != null && List.of("en", "ta", "hi").contains(lang)) ? lang : "en";

        // Resolve localized content with English fallback
        String title = opp.getTitle();
        String description = opp.getDescription();
        String eligibilitySummary = opp.getEligibilitySummary();
        String benefitsDescription = opp.getBenefitsDescription();
        String applicationMethod = opp.getApplicationMethod();

        if (!"en".equals(resolvedLang) && opp.getTranslations() != null) {
            Optional<OpportunityTranslation> trans = opp.getTranslations().stream()
                    .filter(t -> resolvedLang.equals(t.getLanguageCode()))
                    .findFirst();
            if (trans.isPresent()) {
                OpportunityTranslation t = trans.get();
                if (t.getTitle() != null && !t.getTitle().isBlank()) title = t.getTitle();
                if (t.getDescription() != null && !t.getDescription().isBlank()) description = t.getDescription();
                if (t.getEligibilitySummary() != null && !t.getEligibilitySummary().isBlank()) eligibilitySummary = t.getEligibilitySummary();
                if (t.getBenefitsDescription() != null && !t.getBenefitsDescription().isBlank()) benefitsDescription = t.getBenefitsDescription();
                if (t.getApplicationMethod() != null && !t.getApplicationMethod().isBlank()) applicationMethod = t.getApplicationMethod();
            }
        }

        // Build translations map
        Map<String, TranslationDto> translationsMap = new LinkedHashMap<>();
        if (opp.getTranslations() != null) {
            for (OpportunityTranslation t : opp.getTranslations()) {
                translationsMap.put(t.getLanguageCode(), TranslationDto.builder()
                        .title(t.getTitle())
                        .description(t.getDescription())
                        .eligibilitySummary(t.getEligibilitySummary())
                        .benefitsDescription(t.getBenefitsDescription())
                        .applicationMethod(t.getApplicationMethod())
                        .build());
            }
        }

        List<String> docs = opp.getDocuments().stream().map(OpportunityDocument::getName).collect(Collectors.toList());
        List<String> steps = opp.getApplicationSteps().stream().map(OpportunityApplicationStep::getInstruction).collect(Collectors.toList());

        String deadlineStr = "Ongoing";
        boolean isOngoing = true;
        if (!opp.getDeadlines().isEmpty()) {
            OpportunityDeadline d = opp.getDeadlines().get(0);
            if (d.getClosingDate() != null) {
                deadlineStr = d.getClosingDate().toString();
                isOngoing = false;
            } else if (d.getLabel() != null) {
                deadlineStr = d.getLabel();
            }
        }

        // ── Build EligibilityRulesDto (full schema structure) ──────────────────
        OpportunityCriteriaDto critDto = null;
        EligibilityRulesDto eligibilityRules = null;

        if (opp.getEligibility() != null) {
            OpportunityEligibility e = opp.getEligibility();

            // Legacy flat criteria (backwards compat)
            critDto = OpportunityCriteriaDto.builder()
                    .minAge(e.getMinAge())
                    .maxAge(e.getMaxAge())
                    .genderAllowed(e.getGenderAllowed())
                    .allowedStates(e.getAllowedStates() != null ? Arrays.asList(e.getAllowedStates().split(",")) : List.of("All India"))
                    .allowedEducationLevels(e.getAllowedEducationLevels() != null ? Arrays.asList(e.getAllowedEducationLevels().split(",")) : List.of())
                    .allowedCourses(e.getAllowedCourses() != null ? Arrays.asList(e.getAllowedCourses().split(",")) : List.of())
                    .minMarksPercentage(e.getMinMarksPercentage())
                    .maxFamilyIncome(e.getMaxFamilyIncome())
                    .allowedCategories(e.getAllowedCategories() != null ? Arrays.asList(e.getAllowedCategories().split(",")) : List.of())
                    .requiresGovtSchool(e.getRequiresGovtSchool())
                    .requiresFirstGraduate(e.getRequiresFirstGraduate())
                    .requiresPwd(e.getRequiresPwd())
                    .requiresHosteller(e.getRequiresHosteller())
                    .allowedInstitutions(e.getAllowedInstitutions() != null ? Arrays.asList(e.getAllowedInstitutions().split(",")) : List.of())
                    .specialNotes(e.getOtherConditions())
                    .build();

            // ── Academic section: slabs + single thresholds ─────────────────────
            List<CutoffSlabDto> cutoffSlabDtos = opp.getCutoffSlabs().stream()
                    .map(s -> CutoffSlabDto.builder()
                            .minCutoff(s.getMinCutoff())
                            .maxCutoff(s.getMaxCutoff())
                            .tuitionWaiverPercent(s.getTuitionWaiverPercent())
                            .hostelBusWaiverPercent(s.getHostelBusWaiverPercent())
                            .notes(s.getNotes())
                            .build())
                    .collect(Collectors.toList());

            List<PercentageSlabDto> pctSlabDtos = opp.getPercentageSlabs().stream()
                    .map(s -> PercentageSlabDto.builder()
                            .minPercent(s.getMinPercent())
                            .maxPercent(s.getMaxPercent())
                            .benefitPercentage(s.getBenefitPercentage())
                            .hostelWaiverPercent(s.getHostelWaiverPercent())
                            .notes(s.getNotes())
                            .build())
                    .collect(Collectors.toList());

            AcademicEligibilityDto academic = AcademicEligibilityDto.builder()
                    .engineeringCutoffSlabs(cutoffSlabDtos.isEmpty() ? null : cutoffSlabDtos)
                    .twelfthPercentageSlabs(pctSlabDtos.isEmpty() ? null : pctSlabDtos)
                    .minMarksPercentage(e.getMinMarksPercentage())
                    .minEngineeringCutoff(e.getMinEngineeringCutoff())
                    .allowedEducationLevels(e.getAllowedEducationLevels() != null ? Arrays.asList(e.getAllowedEducationLevels().split(",")) : null)
                    .allowedCourses(e.getAllowedCourses() != null ? Arrays.asList(e.getAllowedCourses().split(",")) : null)
                    .build();

            // ── Income section ──────────────────────────────────────────────────
            IncomeEligibilityDto income = IncomeEligibilityDto.builder()
                    .maxAnnualFamilyIncomeInr(e.getMaxFamilyIncome())
                    .requiresIncomeCertificate(Boolean.TRUE.equals(e.getRequiresIncomeCertificate()))
                    .build();

            // ── Demographic & Social section ────────────────────────────────────
            List<String> cats = e.getAllowedCategories() != null
                    ? Arrays.asList(e.getAllowedCategories().split(",")) : List.of();

            DemographicEligibilityDto demographic = DemographicEligibilityDto.builder()
                    .genderAllowed(e.getGenderAllowed())
                    .allowedStates(e.getAllowedStates() != null ? Arrays.asList(e.getAllowedStates().split(",")) : null)
                    .isFirstGraduateOnly(e.getRequiresFirstGraduate())
                    .isGovtSchoolStudentOnly(e.getRequiresGovtSchool())
                    .eligibleCategories(cats)
                    .idCardType(e.getParentIdCardType() != null ? e.getParentIdCardType() : opp.getIdCardType())
                    .parentOccupation(e.getParentOccupation())
                    .religion(e.getReligion())
                    .requiresPwd(e.getRequiresPwd())
                    .requiresHosteller(e.getRequiresHosteller())
                    .allowedInstitutions(e.getAllowedInstitutions() != null ? Arrays.asList(e.getAllowedInstitutions().split(",")) : null)
                    .specialNotes(e.getOtherConditions())
                    .build();

            eligibilityRules = EligibilityRulesDto.builder()
                    .academic(academic)
                    .income(income)
                    .demographicAndSocial(demographic)
                    .build();
        }

        // ── Fee Breakdown ───────────────────────────────────────────────────────
        FeeBreakdownDto feeBreakdown = FeeBreakdownDto.builder()
                .tuitionWaiverPct(opp.getTuitionWaiverPct())
                .hostelWaiverPct(opp.getHostelWaiverPct())
                .transportWaiverPct(opp.getTransportWaiverPct())
                .examFeeCovered(opp.getExamFeeCovered())
                .fullFeeSupport(opp.getFullFeeSupport())
                .build();

        // ── Tenure & Renewal ────────────────────────────────────────────────────
        TenureAndRenewalDto tenureAndRenewal = TenureAndRenewalDto.builder()
                .durationType(opp.getDurationType() != null ? opp.getDurationType() : opp.getFullCourseOrFirstYear())
                .minCgpaRequired(opp.getMinCgpaRenewal())
                .noStandingArrears(opp.getNoStandingArrears())
                .build();

        return OpportunityResponse.builder()
                .id(opp.getId())
                .name(title)           // schema field "name"
                .title(title)
                .providerId(opp.getProvider().getId())
                .provider(mapToProviderDto(opp.getProvider()))
                .governmentLevel(opp.getGovernmentLevel())
                .type(opp.getOpportunityType())
                .scholarshipCategory(opp.getScholarshipCategory())
                .tags(new ArrayList<>(opp.getTags()))
                .categoryTags(new ArrayList<>(opp.getTags()))
                .description(description)
                .eligibilitySummary(eligibilitySummary)
                .benefitsDescription(benefitsDescription)
                .financialAmount(opp.getFinancialAmount())
                .feeBreakdown(feeBreakdown)
                .deadline(deadlineStr)
                .isOngoing(isOngoing)
                .officialWebsiteUrl(opp.getOfficialWebsiteUrl() != null ? opp.getOfficialWebsiteUrl() : opp.getOfficialSourceUrl())
                .officialInfoUrl(opp.getOfficialSourceUrl())
                .officialApplyUrl(opp.getOfficialApplicationUrl())
                .officialScholarshipUrl(opp.getOfficialScholarshipUrl())
                .applicationMethod(applicationMethod)
                .applicationProcess(steps)
                .requiredDocuments(docs)
                .eligibilityRules(eligibilityRules)
                .criteria(critDto)
                .tenureAndRenewal(tenureAndRenewal)
                .verificationStatus(opp.getVerificationStatus())
                .verifiedYear(opp.getVerifiedYear())
                .lastVerifiedDate(opp.getLastVerifiedDate() != null ? opp.getLastVerifiedDate().toString() : "2026-08-22")
                .contactHelpline(opp.getContactHelpline())
                .featured(opp.getFeatured())
                .sportsEligible(opp.getSportsEligible())
                .disabilityEligible(opp.getDisabilityEligible())
                .defenceEligible(opp.getDefenceEligible())
                .idCardType(opp.getIdCardType())
                .institutionId(opp.getInstitutionId())
                .institutionName(opp.getInstitutionName())
                .tuitionFeeSupport(opp.getTuitionFeeSupport())
                .hostelSupport(opp.getHostelSupport())
                .minCutoffMarks(critDto != null ? critDto.getMinMarksPercentage() : null)
                .translations(translationsMap.isEmpty() ? null : translationsMap)
                .build();
    }

    /** Backward-compatible – used by internal callers that don't need a language */
    public OpportunityResponse mapToResponse(Opportunity opp) {
        return mapToResponse(opp, "en");
    }

    // ─── Private Helpers ───────────────────────────────────────────────────────

    private boolean isRecommendedFor(Opportunity opp, StudentProfile p) {
        if (opp.getFeatured() != null && opp.getFeatured()) return true;
        if (opp.getInstitutionId() != null && opp.getInstitutionId().equals(p.getInstitutionId())) return true;
        if (p.getState() != null && opp.getState() != null && opp.getState().equalsIgnoreCase(p.getState())) return true;
        if (p.getEducationLevel() != null && opp.getEducationLevel() != null &&
                opp.getEducationLevel().equalsIgnoreCase(p.getEducationLevel().name())) return true;
        return false;
    }
}

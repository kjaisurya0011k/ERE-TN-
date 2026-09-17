package com.edunova.dto;

import com.edunova.domain.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class OpportunityDtos {

    // ── Translation DTO (multilingual) ────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TranslationDto {
        private String title;
        private String description;
        private String eligibilitySummary;
        private String benefitsDescription;
        private String applicationMethod;
    }

    // ── Provider DTO ──────────────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProviderDto {
        private String id;
        private String name;
        private ProviderType type;
        private String providerCategory;   // COLLEGE / NGO / GOVT / TRUST / CORPORATE / WELFARE_BOARD
        private String description;
        private String mission;
        private String whoTheySupport;
        private String logoUrl;
        private String officialWebsite;
        private String officialWebsiteUrl;
        private String scholarshipPageUrl;
        private String admissionPageUrl;
        private String contactEmail;
        private String contactPhone;
        private String location;
        private String state;
        private VerificationStatus verificationStatus;
        private LocalDate lastVerifiedDate;
        private List<String> focusAreas;
    }

    // ── Engineering Cut-off Slab DTO ──────────────────────────────────────────
    /**
     * Maps to schema: eligibility_rules.academic.engineering_cutoff_slabs[]
     */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CutoffSlabDto {
        private BigDecimal minCutoff;           // e.g. 190.00
        private BigDecimal maxCutoff;           // null = no upper bound
        private BigDecimal tuitionWaiverPercent;
        private BigDecimal hostelBusWaiverPercent;
        private String notes;                   // "100% tuition for 190+"
    }

    // ── 12th Percentage Slab DTO ──────────────────────────────────────────────
    /**
     * Maps to schema: eligibility_rules.academic.12th_percentage_slabs[]
     */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PercentageSlabDto {
        private BigDecimal minPercent;          // e.g. 80.00
        private BigDecimal maxPercent;          // null = no upper bound
        private BigDecimal benefitPercentage;   // tuition waiver %
        private BigDecimal hostelWaiverPercent;
        private String notes;
    }

    // ── Eligibility Rules — Academic Section ──────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AcademicEligibilityDto {
        /** Engineering cut-off slabs (TN 12th cut-off / 200 scale). */
        private List<CutoffSlabDto> engineeringCutoffSlabs;

        /** 12th board percentage slabs (0–100 scale). */
        private List<PercentageSlabDto> twelfthPercentageSlabs;

        /** Single minimum 12th marks percentage (when no slab needed). */
        private BigDecimal minMarksPercentage;

        /** Single minimum engineering cut-off (when no slab needed). */
        private BigDecimal minEngineeringCutoff;

        /** Allowed education levels: UNDERGRADUATE, DIPLOMA, POSTGRADUATE, ALL. */
        private List<String> allowedEducationLevels;

        /** Allowed courses/branches. */
        private List<String> allowedCourses;
    }

    // ── Eligibility Rules — Income Section ────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class IncomeEligibilityDto {
        /** Maximum annual family income in INR. */
        private Long maxAnnualFamilyIncomeInr;

        /** Whether income certificate (Tahsildar/Form-16) is required. */
        private Boolean requiresIncomeCertificate;
    }

    // ── Eligibility Rules — Demographic & Social Section ─────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DemographicEligibilityDto {
        /** Allowed gender: MALE, FEMALE, ANY. */
        private String genderAllowed;

        /** Allowed states. */
        private List<String> allowedStates;

        /** Only first-generation graduates eligible. */
        private Boolean isFirstGraduateOnly;

        /** Only government-school students eligible. */
        private Boolean isGovtSchoolStudentOnly;

        /** Eligible social categories: BC, MBC, DNC, SC, ST, OC, EWS, ALL. */
        private List<String> eligibleCategories;

        /** Parent welfare-board ID card type required (e.g. TN_CONSTRUCTION_WORKER_ID). */
        private String idCardType;

        /** Parent occupation requirement (e.g. CONSTRUCTION_WORKER). */
        private String parentOccupation;

        /** Religion requirement (if any). */
        private String religion;

        /** Differently-abled student required. */
        private Boolean requiresPwd;

        /** Must be a hosteller. */
        private Boolean requiresHosteller;

        /** Allowed institutions (if scheme is institution-specific). */
        private List<String> allowedInstitutions;

        /** Additional eligibility notes. */
        private String specialNotes;
    }

    // ── Full Eligibility Rules DTO ────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EligibilityRulesDto {
        private AcademicEligibilityDto academic;
        private IncomeEligibilityDto income;
        private DemographicEligibilityDto demographicAndSocial;
    }

    // ── Tenure & Renewal DTO ──────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TenureAndRenewalDto {
        /**
         * "One-time / First Year Only" or "Full UG Course Duration (4 Years)"
         * Maps to schema: tenure_and_renewal.duration_type
         */
        private String durationType;

        /** Minimum CGPA required to renew for next year. */
        private BigDecimal minCgpaRequired;

        /** Whether student must have no standing arrears for renewal. */
        private Boolean noStandingArrears;
    }

    // ── Fee Breakdown DTO ─────────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class FeeBreakdownDto {
        private Integer tuitionWaiverPct;         // 0–100
        private Integer hostelWaiverPct;          // 0–100
        private Integer transportWaiverPct;       // 0–100
        private Boolean examFeeCovered;
        private Boolean fullFeeSupport;           // true = all of above 100%
    }

    // ── MAIN OpportunityResponse ──────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OpportunityResponse {
        // Identity
        private String id;
        private String name;   // alias for title — matches JSON schema "name"
        private String title;

        // Provider
        private String providerId;
        private ProviderDto provider;

        // Classification
        private GovernmentLevel governmentLevel;
        private OpportunityType type;
        private String scholarshipCategory;       // TYPE1…TYPE5
        private List<String> tags;                // matches schema tags[]
        private List<String> categoryTags;        // legacy field

        // Description
        private String description;
        private String eligibilitySummary;
        private String benefitsDescription;

        // Financial
        private Long financialAmount;
        private FeeBreakdownDto feeBreakdown;

        // Links
        private String officialWebsiteUrl;
        private String officialInfoUrl;
        private String officialApplyUrl;
        private String officialScholarshipUrl;
        private String applicationMethod;

        // Eligibility Rules (full JSON schema structure)
        private EligibilityRulesDto eligibilityRules;

        // Legacy flat criteria (backwards compat)
        private OpportunityCriteriaDto criteria;

        // Tenure & Renewal
        private TenureAndRenewalDto tenureAndRenewal;

        // Application process
        private List<String> applicationProcess;
        private List<String> requiredDocuments;

        // Status
        private VerificationStatus verificationStatus;
        private String verifiedYear;         // "2026"
        private String lastVerifiedDate;
        private String contactHelpline;

        // Flags
        private Boolean featured;
        private Boolean sportsEligible;
        private Boolean disabilityEligible;
        private Boolean defenceEligible;
        private String idCardType;           // TN_CONSTRUCTION_WORKER_ID etc.

        // Institution
        private String institutionId;
        private String institutionName;
        private Boolean tuitionFeeSupport;
        private Boolean hostelSupport;
        private BigDecimal minCutoffMarks;

        // Deadline
        private String deadline;
        private Boolean isOngoing;

        // Multilingual translations map: key = "ta" | "hi" | "en"
        private Map<String, TranslationDto> translations;
    }

    // ── Legacy criteria DTO (kept for backwards compat) ───────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OpportunityCriteriaDto {
        private Integer minAge;
        private Integer maxAge;
        private String genderAllowed;
        private List<String> allowedStates;
        private List<String> allowedEducationLevels;
        private List<String> allowedCourses;
        private BigDecimal minMarksPercentage;
        private BigDecimal minCutoffMarks;
        private Long maxFamilyIncome;
        private List<String> allowedCategories;
        private Boolean requiresGovtSchool;
        private Boolean requiresFirstGraduate;
        private Boolean requiresPwd;
        private Boolean requiresHosteller;
        private List<String> allowedInstitutions;
        private String specialNotes;
    }

    // ── Create / Update requests ──────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OpportunityCreateRequest {
        private String title;
        private String providerId;
        private OpportunityType type;
        private GovernmentLevel governmentLevel;
        private String description;
        private String eligibilitySummary;
        private String benefitsDescription;
        private Long financialAmount;
        private String deadline;
        private String officialWebsiteUrl;
        private String officialInfoUrl;
        private String officialApplyUrl;
        private String applicationMethod;
        private String state;
        private String educationLevel;
        private Boolean tuitionFeeSupport;
        private Boolean hostelSupport;
        private Boolean featured;
        private String institutionId;
        private String institutionName;
        private VerificationStatus verificationStatus;
        private List<String> categoryTags;
        private List<String> requiredDocuments;
        private List<String> applicationProcess;
        private OpportunityCriteriaDto criteria;
        private List<CutoffSlabDto> cutoffSlabs;
        private List<PercentageSlabDto> percentageSlabs;
        private TenureAndRenewalDto tenureAndRenewal;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OpportunityUpdateRequest {
        private String title;
        private String providerId;
        private OpportunityType type;
        private GovernmentLevel governmentLevel;
        private String description;
        private String eligibilitySummary;
        private String benefitsDescription;
        private Long financialAmount;
        private String deadline;
        private String officialWebsiteUrl;
        private String officialInfoUrl;
        private String officialApplyUrl;
        private String applicationMethod;
        private String state;
        private String educationLevel;
        private Boolean tuitionFeeSupport;
        private Boolean hostelSupport;
        private Boolean featured;
        private String institutionId;
        private String institutionName;
        private VerificationStatus verificationStatus;
        private List<String> categoryTags;
        private List<String> requiredDocuments;
        private List<String> applicationProcess;
        private OpportunityCriteriaDto criteria;
        private List<CutoffSlabDto> cutoffSlabs;
        private List<PercentageSlabDto> percentageSlabs;
        private TenureAndRenewalDto tenureAndRenewal;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OpportunityStatusUpdateRequest {
        private VerificationStatus status;
        private String adminNotes;
    }

    // ── Eligibility Check ─────────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EligibilityCheckRequest {
        private String gender;
        private String state;
        private EducationLevel educationLevel;
        private String courseBranch;
        private BigDecimal marksPercentage;
        private BigDecimal cutoffMarks;
        private Long familyAnnualIncome;
        private SocialCategory socialCategory;
        private Boolean isGovtSchoolStudent;
        private Boolean isFirstGraduate;
        private Boolean isPwd;
        private String institutionId;
        private String parentOccupation;
        private String parentIdCardType;    // NEW: TN_CONSTRUCTION_WORKER_ID etc.
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EligibilityResultItem {
        private OpportunityResponse opportunity;
        private Integer matchPercentage;
        private String status;  // ELIGIBLE, PARTIAL, NOT_ELIGIBLE
        private List<String> reasonsMatched;
        private List<String> missingCriteria;
        private String notes;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EligibilityCheckResponse {
        private List<EligibilityResultItem> results;
        private Integer totalEvaluated;
        private Integer eligibleCount;
        private String notice;
    }
}

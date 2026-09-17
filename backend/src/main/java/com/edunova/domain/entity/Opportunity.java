package com.edunova.domain.entity;

import com.edunova.domain.GovernmentLevel;
import com.edunova.domain.OpportunityType;
import com.edunova.domain.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "opportunities")
public class Opportunity {
    @Id
    @Column(length = 80)
    private String id;

    @Column(nullable = false, length = 400)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "opportunity_type", nullable = false, length = 40)
    private OpportunityType opportunityType;

    @Enumerated(EnumType.STRING)
    @Column(name = "government_level")
    private GovernmentLevel governmentLevel;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id")
    private Institution institution;

    @Column(name = "institution_id", insertable = false, updatable = false)
    private String institutionId;

    @Column(name = "institution_name")
    private String institutionName;

    @Column(name = "education_level")
    private String educationLevel;

    private String state;

    @Column(name = "eligibility_summary", columnDefinition = "TEXT")
    private String eligibilitySummary;

    @Column(name = "benefits_description", columnDefinition = "TEXT")
    private String benefitsDescription;

    @Column(name = "financial_amount")
    private Long financialAmount;

    @Column(name = "official_source_url")
    private String officialSourceUrl;

    @Column(name = "official_application_url")
    private String officialApplicationUrl;

    @Column(name = "application_method")
    private String applicationMethod;

    @Column(name = "contact_helpline")
    private String contactHelpline;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.DEMO_DATA;

    @Column(name = "last_verified_date")
    private LocalDate lastVerifiedDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;

    @Column(name = "tuition_fee_support", nullable = false)
    @Builder.Default
    private Boolean tuitionFeeSupport = false;

    @Column(name = "hostel_support", nullable = false)
    @Builder.Default
    private Boolean hostelSupport = false;

    // ── New Phase-2 fields ─────────────────────────────────────────────────────
    /** Percentage of tuition fee waived (0–100). */
    @Column(name = "tuition_waiver_pct")
    @Builder.Default
    private Integer tuitionWaiverPct = 0;

    /** Percentage of hostel fee waived (0–100). */
    @Column(name = "hostel_waiver_pct")
    @Builder.Default
    private Integer hostelWaiverPct = 0;

    /** Percentage of bus/transport fee waived (0–100). */
    @Column(name = "transport_waiver_pct")
    @Builder.Default
    private Integer transportWaiverPct = 0;

    /** Whether exam/university fee is covered. */
    @Column(name = "exam_fee_covered")
    @Builder.Default
    private Boolean examFeeCovered = false;

    /** FULL_COURSE = continues all years; FIRST_YEAR = first year only; ONE_TIME = single payment. */
    @Column(name = "full_course_or_first_year", length = 20)
    @Builder.Default
    private String fullCourseOrFirstYear = "FULL_COURSE";

    /** TYPE 1–5 scholarship classification. */
    @Column(name = "scholarship_category", length = 40)
    private String scholarshipCategory;

    /** Parent/student ID card type required (e.g. TN_CONSTRUCTION_WORKER_ID). */
    @Column(name = "id_card_type", length = 80)
    private String idCardType;

    /** Official main website of the provider/college. */
    @Column(name = "official_website_url", length = 500)
    private String officialWebsiteUrl;

    /** Direct URL to the scholarship page. */
    @Column(name = "official_scholarship_url", length = 500)
    private String officialScholarshipUrl;

    /** True if the scheme covers 100% of tuition AND hostel AND transport. */
    @Column(name = "full_fee_support")
    @Builder.Default
    private Boolean fullFeeSupport = false;

    /** Sports achievement route available for this scholarship. */
    @Column(name = "sports_eligible")
    @Builder.Default
    private Boolean sportsEligible = false;

    /** Differently-abled / PwD student route available. */
    @Column(name = "disability_eligible")
    @Builder.Default
    private Boolean disabilityEligible = false;

    /** Defence family / ex-servicemen ward route available. */
    @Column(name = "defence_eligible")
    @Builder.Default
    private Boolean defenceEligible = false;

    @ElementCollection
    @CollectionTable(name = "opportunity_tags", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();

    @OneToOne(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    private OpportunityEligibility eligibility;

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<OpportunityDocument> documents = new ArrayList<>();

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    @Builder.Default
    private List<OpportunityApplicationStep> applicationSteps = new ArrayList<>();

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OpportunityDeadline> deadlines = new ArrayList<>();

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OpportunityTranslation> translations = new ArrayList<>();

    // ── V9 Scholarship Master Schema — slab collections ───────────────────────

    /** Engineering cut-off slabs (e.g. 190+ → 100% tuition, 180–189 → 50%). */
    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<OpportunityCutoffSlab> cutoffSlabs = new ArrayList<>();

    /** 12th marks percentage slabs (e.g. 90–100% → 100% tuition, 80–89% → 75%). */
    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<OpportunityPercentageSlab> percentageSlabs = new ArrayList<>();

    // ── V9 Tenure & Renewal fields ─────────────────────────────────────────────

    /**
     * One-time / First Year Only  OR  Full UG Course Duration (4 Years).
     * Maps to schema: tenure_and_renewal.duration_type
     */
    @Column(name = "duration_type", length = 40)
    @Builder.Default
    private String durationType = "FULL_COURSE";

    /** Minimum CGPA required to renew for next year. NULL = no CGPA condition. */
    @Column(name = "min_cgpa_renewal", precision = 4, scale = 2)
    private java.math.BigDecimal minCgpaRenewal;

    /** Whether student must have no standing arrears for renewal. */
    @Column(name = "no_standing_arrears")
    @Builder.Default
    private Boolean noStandingArrears = false;

    /** Academic year this record was last verified (e.g. "2026"). */
    @Column(name = "verified_year", length = 10)
    @Builder.Default
    private String verifiedYear = "2026";
}


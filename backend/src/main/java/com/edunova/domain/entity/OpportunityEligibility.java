package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "opportunity_eligibility")
public class OpportunityEligibility {
    @Id
    @Column(name = "opportunity_id")
    private String opportunityId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;

    private Integer minAge;
    private Integer maxAge;

    @Column(name = "gender_allowed")
    private String genderAllowed;

    @Column(name = "allowed_states")
    private String allowedStates;

    @Column(name = "allowed_education_levels")
    private String allowedEducationLevels;

    @Column(name = "allowed_courses")
    private String allowedCourses;

    /** Minimum 12th board marks percentage. Maps to academic.min_12th_percent. */
    @Column(name = "min_marks_percentage")
    private BigDecimal minMarksPercentage;

    /**
     * Maximum annual family income in INR.
     * Maps to income.max_annual_family_income_inr.
     */
    @Column(name = "max_family_income")
    private Long maxFamilyIncome;

    /**
     * Comma-separated eligible social categories: BC, MBC, DNC, SC, ST, OC, EWS, ALL.
     * Maps to demographic_and_social.eligible_categories[]
     */
    @Column(name = "allowed_categories")
    private String allowedCategories;

    private String religion;
    private String caste;

    @Column(name = "requires_pwd")
    @Builder.Default
    private Boolean requiresPwd = false;

    /**
     * True if applicant must have studied in a government school.
     * Maps to demographic_and_social.is_govt_school_student_only.
     */
    @Column(name = "requires_govt_school")
    @Builder.Default
    private Boolean requiresGovtSchool = false;

    /**
     * True if applicant must be the first graduate in their family.
     * Maps to demographic_and_social.is_first_graduate_only.
     */
    @Column(name = "requires_first_graduate")
    @Builder.Default
    private Boolean requiresFirstGraduate = false;

    @Column(name = "requires_hosteller")
    @Builder.Default
    private Boolean requiresHosteller = false;

    @Column(name = "parent_occupation")
    private String parentOccupation;

    @Column(name = "allowed_institutions")
    private String allowedInstitutions;

    @Column(name = "other_conditions", columnDefinition = "TEXT")
    private String otherConditions;

    // ── V9 new fields (from TamilNaduScholarshipMasterSchema) ─────────────────

    /**
     * Whether an income certificate (Form-16 / Tahsildar) is required.
     * Maps to income.requires_income_certificate.
     */
    @Column(name = "requires_income_certificate")
    @Builder.Default
    private Boolean requiresIncomeCertificate = false;

    /**
     * Minimum engineering cut-off required (used when no slab table — single threshold only).
     * Full slab data lives in opportunity_cutoff_slabs.
     */
    @Column(name = "min_engineering_cutoff", precision = 6, scale = 2)
    private BigDecimal minEngineeringCutoff;

    /**
     * Required parent welfare-board ID card type (e.g. TN_CONSTRUCTION_WORKER_ID).
     * Mirrors opportunity.id_card_type for eligibility checking.
     */
    @Column(name = "parent_id_card_type", length = 80)
    private String parentIdCardType;

    /**
     * JSON-serialised array of eligible social categories for this opportunity.
     * Example: ["BC","MBC","DNC"] — stored as VARCHAR for H2/Postgres compatibility.
     */
    @Column(name = "eligible_categories_json", length = 500)
    private String eligibleCategoriesJson;
}

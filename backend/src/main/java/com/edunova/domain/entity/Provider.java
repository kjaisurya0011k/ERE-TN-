package com.edunova.domain.entity;

import com.edunova.domain.ProviderType;
import com.edunova.domain.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "providers")
public class Provider {
    @Id
    @Column(length = 80)
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ProviderType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String mission;

    @Column(name = "who_they_support", columnDefinition = "TEXT")
    private String whoTheySupport;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "official_website")
    private String officialWebsite;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    private String location;
    private String state;

    /** Official college/org main website. */
    @Column(name = "official_website_url", length = 500)
    private String officialWebsiteUrl;

    /** Direct link to scholarship page. */
    @Column(name = "scholarship_page_url", length = 500)
    private String scholarshipPageUrl;

    /** Admissions/application page URL. */
    @Column(name = "admission_page_url", length = 500)
    private String admissionPageUrl;

    /** High-level category: COLLEGE, NGO, GOVT, TRUST, CORPORATE, WELFARE_BOARD. */
    @Column(name = "provider_category", length = 40)
    private String providerCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.NEEDS_VERIFICATION;

    @Column(name = "last_verified_date")
    private LocalDate lastVerifiedDate;

    @ElementCollection
    @CollectionTable(name = "provider_focus_areas", joinColumns = @JoinColumn(name = "provider_id"))
    @Column(name = "focus_area")
    @Builder.Default
    private Set<String> focusAreas = new HashSet<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProviderTranslation> translations = new ArrayList<>();
}


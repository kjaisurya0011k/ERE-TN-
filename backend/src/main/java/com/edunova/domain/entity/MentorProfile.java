package com.edunova.domain.entity;

import com.edunova.domain.MentorVerificationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "mentor_profiles")
public class MentorProfile {
    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserAccount user;

    private String bio;

    @Column(name = "title_role")
    private String titleRole;

    private String qualification;

    @Column(name = "company_or_institution")
    private String companyOrInstitution;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    private String specialization;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate = BigDecimal.ZERO;

    @Column(name = "rating_avg")
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private MentorVerificationStatus verificationStatus = MentorVerificationStatus.PENDING;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @ElementCollection
    @CollectionTable(name = "mentor_expertise_tags", joinColumns = @JoinColumn(name = "mentor_profile_id"))
    @Column(name = "tag")
    private Set<String> expertiseTags = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "mentor_languages", joinColumns = @JoinColumn(name = "mentor_profile_id"))
    @Column(name = "language")
    private Set<String> languagesSpoken = new HashSet<>();

    @OneToMany(mappedBy = "mentorProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MentorAvailability> availabilities = new ArrayList<>();
}

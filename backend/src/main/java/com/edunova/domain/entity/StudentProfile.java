package com.edunova.domain.entity;

import com.edunova.domain.EducationLevel;
import com.edunova.domain.InstitutionType;
import com.edunova.domain.SocialCategory;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_profiles")
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserAccount user;

    private Integer age;
    private LocalDate dob;
    private String gender;
    private String state;
    private String district;

    @Column(name = "native_state")
    private String nativeState;

    @Enumerated(EnumType.STRING)
    @Column(name = "education_level")
    private EducationLevel educationLevel;

    @Column(name = "class_or_year")
    private String classOrYear;

    @Column(name = "course_branch")
    private String courseBranch;

    @Column(name = "marks_percentage")
    private BigDecimal marksPercentage;

    @Column(name = "family_annual_income")
    private Long familyAnnualIncome;

    @Enumerated(EnumType.STRING)
    @Column(name = "social_category")
    private SocialCategory socialCategory;

    @Column(name = "community_caste")
    private String communityCaste;

    private String religion;

    @Column(name = "is_pwd")
    @Builder.Default
    private Boolean isPwd = false;

    @Column(name = "pwd_percentage")
    private Integer pwdPercentage;

    @Column(name = "is_govt_school_student")
    @Builder.Default
    private Boolean isGovtSchoolStudent = false;

    @Column(name = "is_first_graduate")
    @Builder.Default
    private Boolean isFirstGraduate = false;

    @Column(name = "is_hosteller")
    @Builder.Default
    private Boolean isHosteller = false;

    @Column(name = "parent_occupation")
    private String parentOccupation;

    @Column(name = "institution_id")
    private String institutionId;

    @Column(name = "institution_name")
    private String institutionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "institution_type")
    private InstitutionType institutionType;

    @Column(name = "sports_achievement")
    private String sportsAchievement;

    @ElementCollection
    @CollectionTable(name = "student_career_interests", joinColumns = @JoinColumn(name = "student_profile_id"))
    @Column(name = "interest")
    @Builder.Default
    private Set<String> careerInterests = new HashSet<>();
}

package com.edunova.dto;

import com.edunova.domain.EducationLevel;
import com.edunova.domain.InstitutionType;
import com.edunova.domain.SocialCategory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class StudentProfileDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentProfileRequest {
        private Integer age;
        private LocalDate dob;
        private String gender;
        private String state;
        private String district;
        private String nativeState;
        private EducationLevel educationLevel;
        private String classOrYear;
        private String courseBranch;
        private BigDecimal marksPercentage;
        private Long familyAnnualIncome;
        private SocialCategory socialCategory;
        private String communityCaste;
        private String religion;
        private Boolean isPwd;
        private Integer pwdPercentage;
        private Boolean isGovtSchoolStudent;
        private Boolean isFirstGraduate;
        private Boolean isHosteller;
        private String parentOccupation;
        private String institutionId;
        private String institutionName;
        private InstitutionType institutionType;
        private String sportsAchievement;
        private List<String> careerInterests;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentProfileResponse {
        private UUID id;
        private UUID userId;
        private String fullName;
        private String email;
        private String phone;
        private Integer age;
        private LocalDate dob;
        private String gender;
        private String state;
        private String district;
        private String nativeState;
        private EducationLevel educationLevel;
        private String classOrYear;
        private String courseBranch;
        private BigDecimal marksPercentage;
        private Long familyAnnualIncome;
        private SocialCategory socialCategory;
        private String communityCaste;
        private String religion;
        private Boolean isPwd;
        private Integer pwdPercentage;
        private Boolean isGovtSchoolStudent;
        private Boolean isFirstGraduate;
        private Boolean isHosteller;
        private String parentOccupation;
        private String institutionId;
        private String institutionName;
        private InstitutionType institutionType;
        private String sportsAchievement;
        private List<String> careerInterests;
        private Integer profileCompletionPercentage;
    }
}

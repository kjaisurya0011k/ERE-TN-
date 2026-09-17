package com.edunova.dto;

import com.edunova.domain.UserRole;
import com.edunova.domain.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class AuthDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Valid email address is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;

        @Builder.Default
        private UserRole role = UserRole.STUDENT;

        private String gender;
        private String state;
        private String educationLevel;
        private String socialCategory;
        private Boolean isGovtSchoolStudent;
        private Boolean isFirstGraduate;
        private BigDecimal marksPercentage;
        private Long familyAnnualIncome;
        private String institutionName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MentorRegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6)
        private String password;

        private String phone;
        private String titleRole;
        private String companyOrInstitution;
        private String qualification;
        private Integer yearsOfExperience;
        private String bio;
        private String specialization;
        private BigDecimal hourlyRate;
        private List<String> languagesSpoken;
        private List<String> expertiseTags;
        private String linkedinUrl;
        private String avatarUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        @Builder.Default
        private String type = "Bearer";
        private UUID id;
        private String email;
        private String fullName;
        private String phone;
        private UserRole role;
        private UserStatus status;
        private String avatarUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserSummaryDto {
        private UUID id;
        private String email;
        private String fullName;
        private String phone;
        private UserRole role;
        private UserStatus status;
        private String avatarUrl;
    }
}

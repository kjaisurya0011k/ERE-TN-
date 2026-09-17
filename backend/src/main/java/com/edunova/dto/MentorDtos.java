package com.edunova.dto;

import com.edunova.domain.MentorVerificationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public class MentorDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AvailabilitySlotDto {
        private String weekday;
        private String dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;

        public String getResolvedWeekday() {
            if (weekday != null && !weekday.isBlank()) return weekday;
            if (dayOfWeek != null && !dayOfWeek.isBlank()) return dayOfWeek;
            return "MONDAY";
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MentorProfileResponse {
        private UUID id;
        private UUID userId;
        private String fullName;
        private String email;
        private String phone;
        private String titleRole;
        private String companyOrInstitution;
        private String qualification;
        private Integer yearsOfExperience;
        private String bio;
        private String specialization;
        private BigDecimal hourlyRate;
        private BigDecimal ratingAvg;
        private Integer reviewCount;
        private MentorVerificationStatus verificationStatus;
        private String linkedinUrl;
        private String avatarUrl;
        private List<String> languagesSpoken;
        private List<String> expertiseTags;
        private List<AvailabilitySlotDto> availabilities;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MentorApprovalRequest {
        private MentorVerificationStatus status; // APPROVED or REJECTED
        private String adminNotes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MentorStatsDto {
        private Integer totalBookings;
        private Integer upcomingSessions;
        private Integer completedSessions;
        private Integer totalMeetings;
        private BigDecimal averageRating;
    }
}

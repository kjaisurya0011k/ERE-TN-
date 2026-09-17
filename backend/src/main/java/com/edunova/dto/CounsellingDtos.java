package com.edunova.dto;

import com.edunova.domain.SessionStatus;
import com.edunova.domain.SessionType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CounsellingDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CounsellingBookingRequest {
        @NotNull(message = "Mentor ID is required")
        private UUID mentorId;

        @NotNull(message = "Session date is required")
        private LocalDate sessionDate;

        @NotNull(message = "Start time is required")
        private LocalTime startTime;

        private SessionType sessionType;
        private String notes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CounsellingResponse {
        private UUID id;
        private UUID studentId;
        private String studentName;
        private String studentEmail;
        private UUID mentorId;
        private String mentorName;
        private String mentorTitle;
        private String mentorAvatarUrl;
        private LocalDate sessionDate;
        private LocalTime startTime;
        private SessionType sessionType;
        private SessionStatus status;
        private String notes;
        private OffsetDateTime createdAt;
    }
}

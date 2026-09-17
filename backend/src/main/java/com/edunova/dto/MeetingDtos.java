package com.edunova.dto;

import com.edunova.domain.MeetingPlatform;
import com.edunova.domain.MeetingRegistrationStatus;
import com.edunova.domain.MeetingStatus;
import com.edunova.domain.MeetingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

public class MeetingDtos {

    // ── Create / Edit request (mentor) ───────────────────────────────────────
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MeetingCreateRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Topic is required")
        private String topic;

        private MeetingType meetingType;

        @NotNull(message = "Meeting date is required")
        private LocalDate meetingDate;

        @NotNull(message = "Start time is required")
        private LocalTime startTime;

        @NotNull(message = "End time is required")
        private LocalTime endTime;

        private Integer maxParticipants;
        private String language;
        private String targetAudience;
        private String educationLevel;
        private String careerCategory;
        private String meetingAgenda;

        /** Selected meeting platform. Defaults to BUILT_IN_WEBRTC if omitted. */
        private MeetingPlatform meetingPlatform;

        /**
         * External meeting URL — required when meetingPlatform = EXTERNAL_URL.
         * Must be a valid HTTPS URL.  Never exposed to unauthenticated callers.
         */
        @Pattern(
            regexp = "^$|^https://.*",
            message = "Meeting URL must be a valid HTTPS URL (e.g. https://meet.google.com/abc-def)"
        )
        private String meetingUrl;

        /** Mentor-private notes / additional resources (not shown to students). */
        private String notes;
    }

    // ── Public response ──────────────────────────────────────────────────────
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MeetingResponse {
        private UUID id;
        private UUID mentorId;
        private String mentorName;
        private String mentorRole;
        private String mentorAvatarUrl;
        private String title;
        private String description;
        private String topic;
        private MeetingType meetingType;
        private LocalDate meetingDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer maxParticipants;
        private Long registeredCount;
        private Integer seatsAvailable;
        private String language;
        private String targetAudience;
        private String educationLevel;
        private String careerCategory;
        private String meetingAgenda;
        private MeetingStatus status;
        private String rejectionReason;
        private String roomCode;
        private Boolean isUserRegistered;
        private OffsetDateTime createdAt;

        /** Platform used for this session. */
        private MeetingPlatform meetingPlatform;

        /**
         * External meeting URL.  Null unless the requesting user is the session host,
         * an admin, or a registered participant.
         */
        private String meetingUrl;

        /** UUID of the admin who approved this session. */
        private UUID approvedBy;

        /** Timestamp of approval. */
        private OffsetDateTime approvedAt;
    }

    // ── Admin approval request ───────────────────────────────────────────────
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MeetingApprovalRequest {
        @NotNull
        private MeetingStatus status; // APPROVED or REJECTED
        /** Required when status = REJECTED. */
        private String rejectionReason;
    }

    // ── WebRTC room response (unchanged) ─────────────────────────────────────
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MeetingRoomResponse {
        private UUID meetingId;
        private String title;
        private String topic;
        private String roomCode;
        private String mentorName;
        private UUID currentUserId;
        private String currentUserName;
        private String currentUserRole;
        private boolean isHost;
        private LocalDate meetingDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private MeetingStatus status;
    }
}

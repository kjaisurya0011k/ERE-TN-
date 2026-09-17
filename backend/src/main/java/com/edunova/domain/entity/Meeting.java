package com.edunova.domain.entity;

import com.edunova.domain.MeetingPlatform;
import com.edunova.domain.MeetingStatus;
import com.edunova.domain.MeetingType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private UserAccount mentor;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 160)
    private String topic;

    @Enumerated(EnumType.STRING)
    @Column(name = "meeting_type", nullable = false, length = 40)
    @Builder.Default
    private MeetingType meetingType = MeetingType.CAREER_GUIDANCE;

    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "max_participants", nullable = false)
    @Builder.Default
    private Integer maxParticipants = 50;

    @Column(length = 40)
    @Builder.Default
    private String language = "English";

    @Column(name = "target_audience", length = 160)
    private String targetAudience;

    @Column(name = "education_level", length = 40)
    private String educationLevel;

    @Column(name = "career_category", length = 80)
    private String careerCategory;

    @Column(name = "meeting_agenda", columnDefinition = "TEXT")
    private String meetingAgenda;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private MeetingStatus status = MeetingStatus.PENDING_APPROVAL;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "room_code", nullable = false, unique = true, length = 64)
    private String roomCode;

    // ── V10 additions ────────────────────────────────────────────────────────
    /** Platform used to host this session. */
    @Enumerated(EnumType.STRING)
    @Column(name = "meeting_platform", length = 40)
    @Builder.Default
    private MeetingPlatform meetingPlatform = MeetingPlatform.BUILT_IN_WEBRTC;

    /**
     * External meeting URL supplied by the mentor (HTTPS only).
     * Exposed ONLY to the session host and registered participants — never to
     * unauthenticated visitors or non-registered students.
     */
    @Column(name = "meeting_url", length = 500)
    private String meetingUrl;

    /** Admin user-ID who last approved this session. */
    @Column(name = "approved_by")
    private UUID approvedBy;

    /** Timestamp when the session was approved. */
    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    /** Mentor-private notes / resources (not exposed publicly). */
    @Column(columnDefinition = "TEXT")
    private String notes;
    // ─────────────────────────────────────────────────────────────────────────

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}

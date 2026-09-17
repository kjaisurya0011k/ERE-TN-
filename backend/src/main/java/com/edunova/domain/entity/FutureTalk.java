package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "future_talks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FutureTalk {

    @Id
    @Column(length = 80)
    private String id;

    @Column(nullable = false, length = 400)
    private String title;

    @Column(name = "speaker_name", nullable = false, length = 160)
    private String speakerName;

    @Column(name = "speaker_role", length = 160)
    private String speakerRole;

    @Column(name = "speaker_company", length = 160)
    private String speakerCompany;

    @Column(name = "speaker_avatar_url", length = 500)
    private String speakerAvatarUrl;

    @Column(name = "topic_domain", length = 80)
    private String topicDomain;

    @Column(name = "talk_date", nullable = false)
    private LocalDate talkDate;

    @Column(name = "talk_time", nullable = false, length = 20)
    private String talkTime;

    @Column(name = "duration_minutes", nullable = false)
    @Builder.Default
    private Integer durationMinutes = 60;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "UPCOMING";
}

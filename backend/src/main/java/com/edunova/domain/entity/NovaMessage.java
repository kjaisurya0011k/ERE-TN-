package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "nova_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NovaMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private NovaConversation conversation;

    @Column(nullable = false, length = 16)
    private String role; // 'user', 'assistant', 'system'

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "action_payload", columnDefinition = "TEXT")
    private String actionPayload; // JSON for interactive action buttons and roadmap data

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}

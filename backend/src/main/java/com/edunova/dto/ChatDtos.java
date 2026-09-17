package com.edunova.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class ChatDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatMessageRequest {
        @NotNull(message = "Recipient ID is required")
        private UUID recipientId;

        @NotBlank(message = "Message body is required")
        private String body;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatMessageResponse {
        private UUID id;
        private UUID conversationId;
        private UUID senderId;
        private String senderName;
        private String body;
        private OffsetDateTime readAt;
        private OffsetDateTime createdAt;
        private boolean isFromCurrentUser;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConversationResponse {
        private UUID id;
        private UUID otherUserId;
        private String otherUserName;
        private String otherUserRole;
        private String otherUserAvatar;
        private String lastMessage;
        private OffsetDateTime lastMessageTime;
        private Integer unreadCount;
    }
}

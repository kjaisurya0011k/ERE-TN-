package com.edunova.dto;

import com.edunova.domain.NotificationType;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

public class NotificationDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationResponse {
        private UUID id;
        private String title;
        private String message;
        private NotificationType type;
        private String link;
        private Boolean isRead;
        private OffsetDateTime createdAt;
    }
}

package com.edunova.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class NovaDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NovaChatRequest {
        @NotBlank(message = "Message cannot be empty")
        private String message;

        private UUID conversationId;
        private String sessionToken;

        @Builder.Default
        private String language = "en"; // 'en', 'ta', 'hi'
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NovaActionLinkDto {
        private String type; // 'CHECK_ELIGIBILITY', 'OPPORTUNITY', 'MENTOR', 'COURSE', 'MEETING', 'FUTURE_TALK', 'ROADMAP', 'OFFICIAL_URL'
        private String label;
        private String url;
        private String badge;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NovaRoadmapStageDto {
        private int stageNumber;
        private String title;
        private String description;
        private List<String> skills;
        private String keyMilestone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NovaRoadmapDto {
        private String goal;
        private String estimatedMonths;
        private List<NovaRoadmapStageDto> stages;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NovaChatResponse {
        private UUID conversationId;
        private UUID messageId;
        private String role;
        private String content;
        private String language;
        private List<NovaActionLinkDto> actionButtons;
        private NovaRoadmapDto roadmap;
        private OffsetDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NovaConversationSummaryDto {
        private UUID id;
        private String title;
        private String language;
        private String lastMessage;
        private OffsetDateTime updatedAt;
        private int messageCount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SaveRoadmapRequest {
        @NotBlank
        private String title;
        @NotBlank
        private String goal;
        @NotBlank
        private String roadmapJson;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SavedRoadmapResponse {
        private UUID id;
        private String title;
        private String goal;
        private String roadmapJson;
        private OffsetDateTime createdAt;
    }
}

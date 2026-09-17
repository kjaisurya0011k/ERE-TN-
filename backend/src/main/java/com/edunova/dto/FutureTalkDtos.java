package com.edunova.dto;

import lombok.*;

import java.time.LocalDate;

public class FutureTalkDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FutureTalkResponse {
        private String id;
        private String title;
        private String speakerName;
        private String speakerRole;
        private String speakerCompany;
        private String speakerAvatarUrl;
        private String topicDomain;
        private LocalDate talkDate;
        private String talkTime;
        private Integer durationMinutes;
        private String description;
        private Integer maxParticipants;
        private Long registeredCount;
        private String meetingLink;
        private String status;
        private Boolean isUserRegistered;
    }
}

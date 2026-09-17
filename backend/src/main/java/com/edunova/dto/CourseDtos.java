package com.edunova.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class CourseDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonDto {
        private UUID id;
        private String title;
        private Integer durationMinutes;
        private String videoUrl;
        private Integer sortOrder;
        private Boolean isCompleted;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourseModuleDto {
        private UUID id;
        private String title;
        private Integer sortOrder;
        private List<LessonDto> lessons;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourseResponse {
        private String id;
        private String title;
        private String thumbnailUrl;
        private String instructorName;
        private String instructorRole;
        private String level;
        private Integer durationHours;
        private String category;
        private String description;
        private Boolean isPremium;
        private BigDecimal rating;
        private Integer enrolledStudents;
        private List<String> whatYouWillLearn;
        private List<CourseModuleDto> modules;
        private Boolean isUserEnrolled;
        private Integer progressPercentage;
        private Integer totalLessons;
        private Integer completedLessons;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonProgressRequest {
        private Boolean completed;
    }
}

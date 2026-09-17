package com.edunova.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @Column(length = 80)
    private String id;

    @Column(nullable = false, length = 400)
    private String title;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "instructor_name", length = 160)
    private String instructorName;

    @Column(name = "instructor_role", length = 160)
    private String instructorRole;

    @Column(length = 24)
    private String level;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(length = 80)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_premium", nullable = false)
    @Builder.Default
    private Boolean isPremium = false;

    @Column(nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(4.9);

    @Column(name = "enrolled_students", nullable = false)
    @Builder.Default
    private Integer enrolledStudents = 0;

    @ElementCollection
    @CollectionTable(name = "course_learn_items", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "item")
    @Builder.Default
    private List<String> whatYouWillLearn = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<CourseModule> modules = new ArrayList<>();
}

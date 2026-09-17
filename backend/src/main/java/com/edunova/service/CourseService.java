package com.edunova.service;

import com.edunova.domain.entity.*;
import com.edunova.dto.CourseDtos.*;
import com.edunova.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository progressRepository;
    private final UserAccountRepository userRepository;

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses(UUID currentUserId) {
        return courseRepository.findAll().stream()
                .map(c -> mapToResponse(c, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(String id, UUID currentUserId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));
        return mapToResponse(course, currentUserId);
    }

    @Transactional
    public CourseResponse enrollInCourse(String courseId, UUID currentUserId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        UserAccount user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!enrollmentRepository.existsByCourseIdAndUserId(courseId, currentUserId)) {
            CourseEnrollment enrollment = CourseEnrollment.builder()
                    .course(course)
                    .user(user)
                    .build();
            enrollmentRepository.save(enrollment);

            course.setEnrolledStudents(course.getEnrolledStudents() + 1);
            courseRepository.save(course);
        }

        return mapToResponse(course, currentUserId);
    }

    @Transactional
    public void updateLessonProgress(UUID lessonId, UUID currentUserId, boolean completed) {
        LessonProgress prog = progressRepository.findByLessonIdAndUserId(lessonId, currentUserId)
                .orElseGet(() -> {
                    Lesson lesson = new Lesson();
                    lesson.setId(lessonId);
                    UserAccount user = userRepository.findById(currentUserId).orElseThrow();
                    return LessonProgress.builder().lesson(lesson).user(user).build();
                });

        prog.setCompleted(completed);
        progressRepository.save(prog);
    }

    private CourseResponse mapToResponse(Course c, UUID currentUserId) {
        boolean isEnrolled = false;
        List<LessonProgress> userProgress = List.of();
        if (currentUserId != null) {
            isEnrolled = enrollmentRepository.existsByCourseIdAndUserId(c.getId(), currentUserId);
            userProgress = progressRepository.findByLesson_Module_Course_IdAndUserId(c.getId(), currentUserId);
        }

        int totalLessons = 0;
        int completedLessons = 0;

        List<CourseModuleDto> moduleDtos = new ArrayList<>();
        for (CourseModule mod : c.getModules()) {
            List<LessonDto> lessonDtos = new ArrayList<>();
            for (Lesson les : mod.getLessons()) {
                totalLessons++;
                boolean isDone = userProgress.stream().anyMatch(p -> p.getLesson().getId().equals(les.getId()) && Boolean.TRUE.equals(p.getCompleted()));
                if (isDone) completedLessons++;

                lessonDtos.add(LessonDto.builder()
                        .id(les.getId())
                        .title(les.getTitle())
                        .durationMinutes(les.getDurationMinutes())
                        .videoUrl(les.getVideoUrl())
                        .sortOrder(les.getSortOrder())
                        .isCompleted(isDone)
                        .build());
            }

            moduleDtos.add(CourseModuleDto.builder()
                    .id(mod.getId())
                    .title(mod.getTitle())
                    .sortOrder(mod.getSortOrder())
                    .lessons(lessonDtos)
                    .build());
        }

        int progressPct = totalLessons > 0 ? (int) Math.round(((double) completedLessons / totalLessons) * 100) : 0;

        return CourseResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .thumbnailUrl(c.getThumbnailUrl())
                .instructorName(c.getInstructorName())
                .instructorRole(c.getInstructorRole())
                .level(c.getLevel())
                .durationHours(c.getDurationHours())
                .category(c.getCategory())
                .description(c.getDescription())
                .isPremium(c.getIsPremium())
                .rating(c.getRating())
                .enrolledStudents(c.getEnrolledStudents())
                .whatYouWillLearn(new ArrayList<>(c.getWhatYouWillLearn()))
                .modules(moduleDtos)
                .isUserEnrolled(isEnrolled)
                .progressPercentage(progressPct)
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .build();
    }
}

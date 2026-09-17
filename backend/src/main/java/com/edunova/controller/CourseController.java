package com.edunova.controller;

import com.edunova.dto.CourseDtos.CourseResponse;
import com.edunova.dto.CourseDtos.LessonProgressRequest;
import com.edunova.security.UserPrincipal;
import com.edunova.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses(@AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(courseService.getAllCourses(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(courseService.getCourseById(id, userId));
    }

    @PostMapping("/{id}/enroll")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CourseResponse> enrollInCourse(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(courseService.enrollInCourse(id, principal.getId()));
    }

    @PutMapping("/lessons/{id}/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateLessonProgress(
            @PathVariable UUID id,
            @RequestBody LessonProgressRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        courseService.updateLessonProgress(id, principal.getId(), Boolean.TRUE.equals(request.getCompleted()));
        return ResponseEntity.ok().build();
    }
}

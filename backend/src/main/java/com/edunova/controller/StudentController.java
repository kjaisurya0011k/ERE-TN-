package com.edunova.controller;

import com.edunova.dto.StudentProfileDtos.StudentProfileRequest;
import com.edunova.dto.StudentProfileDtos.StudentProfileResponse;
import com.edunova.security.UserPrincipal;
import com.edunova.service.StudentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentProfileService studentProfileService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(studentProfileService.getProfile(principal.getId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody StudentProfileRequest request) {
        return ResponseEntity.ok(studentProfileService.updateProfile(principal.getId(), request));
    }
}

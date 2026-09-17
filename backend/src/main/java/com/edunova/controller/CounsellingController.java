package com.edunova.controller;

import com.edunova.domain.SessionStatus;
import com.edunova.dto.CounsellingDtos.CounsellingBookingRequest;
import com.edunova.dto.CounsellingDtos.CounsellingResponse;
import com.edunova.security.UserPrincipal;
import com.edunova.service.CounsellingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/counselling")
@RequiredArgsConstructor
public class CounsellingController {

    private final CounsellingService counsellingService;

    @PostMapping("/book")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<CounsellingResponse> bookSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CounsellingBookingRequest request) {
        return ResponseEntity.ok(counsellingService.bookSession(principal.getId(), request));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<CounsellingResponse>> getStudentSessions(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(counsellingService.getStudentSessions(principal.getId()));
    }

    @GetMapping("/mentor")
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CounsellingResponse>> getMentorSessions(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(counsellingService.getMentorSessions(principal.getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<CounsellingResponse> updateSessionStatus(
            @PathVariable UUID id,
            @RequestParam SessionStatus status,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(counsellingService.updateSessionStatus(id, principal.getId(), status));
    }
}

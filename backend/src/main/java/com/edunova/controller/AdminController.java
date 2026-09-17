package com.edunova.controller;

import com.edunova.dto.MeetingDtos.MeetingApprovalRequest;
import com.edunova.dto.MeetingDtos.MeetingResponse;
import com.edunova.dto.MentorDtos.MentorApprovalRequest;
import com.edunova.dto.MentorDtos.MentorProfileResponse;
import com.edunova.dto.OpportunityDtos.OpportunityCreateRequest;
import com.edunova.dto.OpportunityDtos.OpportunityResponse;
import com.edunova.dto.OpportunityDtos.OpportunityStatusUpdateRequest;
import com.edunova.dto.OpportunityDtos.OpportunityUpdateRequest;
import com.edunova.security.UserPrincipal;
import com.edunova.service.AdminService;
import com.edunova.service.OpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OpportunityService opportunityService;

    // ── Mentor management ─────────────────────────────────────────────────────

    @GetMapping("/mentors/pending")
    public ResponseEntity<List<MentorProfileResponse>> getPendingMentors() {
        return ResponseEntity.ok(adminService.getPendingMentors());
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<MentorProfileResponse>> getAllMentors() {
        return ResponseEntity.ok(adminService.getAllMentors());
    }

    @PutMapping("/mentors/{id}/status")
    public ResponseEntity<MentorProfileResponse> updateMentorStatus(
            @PathVariable UUID id,
            @RequestBody MentorApprovalRequest request) {
        return ResponseEntity.ok(adminService.updateMentorStatus(id, request));
    }

    // ── Session management ────────────────────────────────────────────────────

    /** All sessions (all statuses) — for the admin sessions management view. */
    @GetMapping("/meetings")
    public ResponseEntity<List<MeetingResponse>> getAllMeetings() {
        return ResponseEntity.ok(adminService.getAllMeetings());
    }

    /** Sessions pending approval only. */
    @GetMapping("/meetings/pending")
    public ResponseEntity<List<MeetingResponse>> getPendingMeetings() {
        return ResponseEntity.ok(adminService.getPendingMeetings());
    }

    /**
     * Approve or reject a session.
     * Requires admin authentication — mentors cannot call this endpoint.
     */
    @PutMapping("/meetings/{id}/status")
    public ResponseEntity<MeetingResponse> updateMeetingStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody MeetingApprovalRequest request) {
        return ResponseEntity.ok(adminService.updateMeetingStatus(id, principal.getId(), request));
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }

    // ── Opportunity management ────────────────────────────────────────────────

    @PostMapping("/opportunities")
    public ResponseEntity<OpportunityResponse> createOpportunity(
            @RequestBody OpportunityCreateRequest request) {
        return ResponseEntity.ok(opportunityService.createOpportunity(request));
    }

    @PutMapping("/opportunities/{id}")
    public ResponseEntity<OpportunityResponse> updateOpportunity(
            @PathVariable String id,
            @RequestBody OpportunityUpdateRequest request) {
        return ResponseEntity.ok(opportunityService.updateOpportunity(id, request));
    }

    @PutMapping("/opportunities/{id}/status")
    public ResponseEntity<OpportunityResponse> updateOpportunityStatus(
            @PathVariable String id,
            @RequestBody OpportunityStatusUpdateRequest request) {
        return ResponseEntity.ok(opportunityService.updateVerificationStatus(id, request.getStatus()));
    }

    @DeleteMapping("/opportunities/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable String id) {
        opportunityService.deleteOpportunity(id);
        return ResponseEntity.noContent().build();
    }
}

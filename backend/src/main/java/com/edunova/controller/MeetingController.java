package com.edunova.controller;

import com.edunova.dto.MeetingDtos.MeetingCreateRequest;
import com.edunova.dto.MeetingDtos.MeetingResponse;
import com.edunova.dto.MeetingDtos.MeetingRoomResponse;
import com.edunova.security.UserPrincipal;
import com.edunova.service.MeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    /** Public: approved upcoming sessions (URL hidden from unauthenticated callers). */
    @GetMapping
    public ResponseEntity<List<MeetingResponse>> getUpcomingApprovedMeetings(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID currentUserId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(meetingService.getApprovedUpcomingMeetings(currentUserId));
    }

    /** Authenticated: sessions the current student has registered for. */
    @GetMapping("/registered")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MeetingResponse>> getStudentRegisteredMeetings(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(meetingService.getStudentRegisteredMeetings(principal.getId()));
    }

    /** Mentor/Admin: sessions created by the current mentor. */
    @GetMapping("/mentor")
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<MeetingResponse>> getMentorMeetings(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(meetingService.getMentorMeetings(principal.getId()));
    }

    /** Public: single session by ID. */
    @GetMapping("/{id}")
    public ResponseEntity<MeetingResponse> getMeetingById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID currentUserId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(meetingService.getMeetingById(id, currentUserId));
    }

    /** Mentor/Admin: create a new session. Goes to PENDING_APPROVAL. */
    @PostMapping
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<MeetingResponse> createMeeting(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MeetingCreateRequest request) {
        return ResponseEntity.ok(meetingService.createMeeting(principal.getId(), request));
    }

    /**
     * Mentor: edit and resubmit a REJECTED or DRAFT session.
     * Only the session's own mentor may call this.
     */
    @PutMapping("/{id}/resubmit")
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<MeetingResponse> resubmitMeeting(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MeetingCreateRequest request) {
        return ResponseEntity.ok(meetingService.updateAndResubmit(id, principal.getId(), request));
    }

    /** Authenticated: register the current user for a session. */
    @PostMapping("/{id}/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MeetingResponse> registerForMeeting(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(meetingService.registerForMeeting(id, principal.getId()));
    }

    /** Authenticated: cancel registration for a session. */
    @PostMapping("/{id}/cancel-registration")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MeetingResponse> cancelRegistration(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(meetingService.cancelRegistration(id, principal.getId()));
    }

    /** Authenticated: join built-in WebRTC room by room code. */
    @GetMapping("/room/{roomCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MeetingRoomResponse> getMeetingRoom(
            @PathVariable String roomCode,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(meetingService.getMeetingRoomDetails(roomCode, principal.getId()));
    }
}

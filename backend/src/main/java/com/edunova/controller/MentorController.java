package com.edunova.controller;

import com.edunova.dto.MentorDtos.AvailabilitySlotDto;
import com.edunova.dto.MentorDtos.MentorProfileResponse;
import com.edunova.dto.MentorDtos.MentorStatsDto;
import com.edunova.security.UserPrincipal;
import com.edunova.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MentorController {

    private final MentorService mentorService;

    @GetMapping("/api/mentors")
    public ResponseEntity<List<MentorProfileResponse>> getApprovedMentors() {
        return ResponseEntity.ok(mentorService.getApprovedMentors());
    }

    @GetMapping("/api/mentors/{id}")
    public ResponseEntity<MentorProfileResponse> getMentorById(@PathVariable UUID id) {
        return ResponseEntity.ok(mentorService.getMentorById(id));
    }

    @GetMapping("/api/mentor/profile")
    @PreAuthorize("hasRole('MENTOR') or hasRole('ADMIN')")
    public ResponseEntity<MentorProfileResponse> getOwnMentorProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(mentorService.getMentorProfileByUserId(principal.getId()));
    }

    @PutMapping("/api/mentor/profile")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<MentorProfileResponse> updateOwnMentorProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody MentorProfileResponse request) {
        return ResponseEntity.ok(mentorService.updateMentorProfile(principal.getId(), request));
    }

    @PutMapping("/api/mentor/availability")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<MentorProfileResponse> updateAvailability(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody List<AvailabilitySlotDto> slots) {
        return ResponseEntity.ok(mentorService.setAvailability(principal.getId(), slots));
    }

    @GetMapping("/api/mentor/stats")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<MentorStatsDto> getMentorStats(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(mentorService.getMentorStats(principal.getId()));
    }
}

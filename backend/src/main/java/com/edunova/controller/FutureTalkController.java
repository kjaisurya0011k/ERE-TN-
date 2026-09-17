package com.edunova.controller;

import com.edunova.dto.FutureTalkDtos.FutureTalkResponse;
import com.edunova.security.UserPrincipal;
import com.edunova.service.FutureTalkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/future-talks")
@RequiredArgsConstructor
public class FutureTalkController {

    private final FutureTalkService futureTalkService;

    @GetMapping
    public ResponseEntity<List<FutureTalkResponse>> getAllTalks(@AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(futureTalkService.getAllTalks(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FutureTalkResponse> getTalkById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(futureTalkService.getTalkById(id, userId));
    }

    @PostMapping("/{id}/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FutureTalkResponse> registerForTalk(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(futureTalkService.registerForTalk(id, principal.getId()));
    }
}

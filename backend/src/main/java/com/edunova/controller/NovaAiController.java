package com.edunova.controller;

import com.edunova.dto.NovaDtos.*;
import com.edunova.security.UserPrincipal;
import com.edunova.service.NovaAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/nova")
@RequiredArgsConstructor
public class NovaAiController {

    private final NovaAiService novaAiService;

    @PostMapping("/chat")
    public ResponseEntity<NovaChatResponse> chat(
            @Valid @RequestBody NovaChatRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(novaAiService.processChat(request, userId));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<NovaConversationSummaryDto>> getConversations(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(novaAiService.getUserConversations(principal.getId()));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<List<NovaChatResponse>> getConversationMessages(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(novaAiService.getConversationMessages(id, userId));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        novaAiService.deleteConversation(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/roadmaps")
    public ResponseEntity<SavedRoadmapResponse> saveRoadmap(
            @Valid @RequestBody SaveRoadmapRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(novaAiService.saveRoadmap(request, principal.getId()));
    }

    @GetMapping("/roadmaps")
    public ResponseEntity<List<SavedRoadmapResponse>> getSavedRoadmaps(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(novaAiService.getSavedRoadmaps(principal.getId()));
    }
}

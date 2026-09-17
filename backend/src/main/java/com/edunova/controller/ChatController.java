package com.edunova.controller;

import com.edunova.dto.ChatDtos.ChatMessageRequest;
import com.edunova.dto.ChatDtos.ChatMessageResponse;
import com.edunova.dto.ChatDtos.ConversationResponse;
import com.edunova.security.UserPrincipal;
import com.edunova.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(chatService.getUserConversations(principal.getId()));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(chatService.getMessages(id, principal.getId()));
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChatMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(principal.getId(), request));
    }
}

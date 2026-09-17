package com.edunova.controller;

import com.edunova.dto.OpportunityDtos.OpportunityResponse;
import com.edunova.security.UserPrincipal;
import com.edunova.service.SavedOpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/saved-opportunities")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class SavedOpportunityController {

    private final SavedOpportunityService savedOpportunityService;

    @GetMapping
    public ResponseEntity<List<OpportunityResponse>> getSavedOpportunities(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(savedOpportunityService.getSavedOpportunities(principal.getId()));
    }

    @PostMapping("/{opportunityId}")
    public ResponseEntity<Void> saveOpportunity(
            @PathVariable String opportunityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        savedOpportunityService.saveOpportunity(principal.getId(), opportunityId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{opportunityId}")
    public ResponseEntity<Void> removeSavedOpportunity(
            @PathVariable String opportunityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        savedOpportunityService.removeSavedOpportunity(principal.getId(), opportunityId);
        return ResponseEntity.ok().build();
    }
}

package com.edunova.controller;

import com.edunova.domain.OpportunityType;
import com.edunova.domain.VerificationStatus;
import com.edunova.domain.entity.Institution;
import com.edunova.dto.OpportunityDtos.OpportunityResponse;
import com.edunova.dto.OpportunityDtos.ProviderDto;
import com.edunova.security.UserPrincipal;
import com.edunova.service.OpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;

    private String resolveLang(String langParam, String acceptLanguage) {
        if (langParam != null && List.of("en", "ta", "hi").contains(langParam.toLowerCase())) {
            return langParam.toLowerCase();
        }
        if (acceptLanguage != null && !acceptLanguage.isBlank()) {
            String first = acceptLanguage.split("[,;]")[0].trim().toLowerCase();
            if (List.of("en", "ta", "hi").contains(first)) return first;
        }
        return "en";
    }

    @GetMapping("/api/opportunities")
    public ResponseEntity<List<OpportunityResponse>> getOpportunities(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) OpportunityType type,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) VerificationStatus verification,
            @RequestParam(required = false, defaultValue = "en") String lang,
            @RequestHeader(name = "Accept-Language", required = false) String acceptLang) {
        String resolvedLang = resolveLang(lang, acceptLang);
        return ResponseEntity.ok(opportunityService.getAllOpportunities(query, type, state, verification, resolvedLang));
    }

    @GetMapping("/api/opportunities/{id}")
    public ResponseEntity<OpportunityResponse> getOpportunityById(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "en") String lang,
            @RequestHeader(name = "Accept-Language", required = false) String acceptLang) {
        String resolvedLang = resolveLang(lang, acceptLang);
        return ResponseEntity.ok(opportunityService.getOpportunityById(id, resolvedLang));
    }

    @GetMapping("/api/opportunities/recommended")
    public ResponseEntity<List<OpportunityResponse>> getRecommendedOpportunities(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "en") String lang,
            @RequestHeader(name = "Accept-Language", required = false) String acceptLang) {
        String resolvedLang = resolveLang(lang, acceptLang);
        if (principal == null) {
            return ResponseEntity.ok(opportunityService.getAllOpportunities(null, null, null, null, resolvedLang));
        }
        return ResponseEntity.ok(opportunityService.getRecommendedOpportunities(principal.getId(), resolvedLang));
    }

    @GetMapping("/api/providers")
    public ResponseEntity<List<ProviderDto>> getProviders() {
        return ResponseEntity.ok(opportunityService.getAllProviders());
    }

    @GetMapping("/api/providers/{id}")
    public ResponseEntity<ProviderDto> getProviderById(@PathVariable String id) {
        return ResponseEntity.ok(opportunityService.getProviderById(id));
    }

    @GetMapping("/api/institutions")
    public ResponseEntity<List<Institution>> getInstitutions() {
        return ResponseEntity.ok(opportunityService.getAllInstitutions());
    }
}

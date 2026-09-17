package com.edunova.controller;

import com.edunova.dto.OpportunityDtos.EligibilityCheckRequest;
import com.edunova.dto.OpportunityDtos.EligibilityCheckResponse;
import com.edunova.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eligibility")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;

    @PostMapping("/check")
    public ResponseEntity<EligibilityCheckResponse> checkEligibility(
            @RequestBody EligibilityCheckRequest request,
            @RequestParam(required = false, defaultValue = "en") String lang,
            @RequestHeader(name = "Accept-Language", required = false) String acceptLang) {
        String resolvedLang = "en";
        if (lang != null && List.of("en", "ta", "hi").contains(lang.toLowerCase())) {
            resolvedLang = lang.toLowerCase();
        } else if (acceptLang != null && !acceptLang.isBlank()) {
            String first = acceptLang.split("[,;]")[0].trim().toLowerCase();
            if (List.of("en", "ta", "hi").contains(first)) resolvedLang = first;
        }
        return ResponseEntity.ok(eligibilityService.evaluateEligibility(request, resolvedLang));
    }
}

package com.edunova.controller;

import com.edunova.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ApiController {

    private final OpportunityRepository opportunityRepository;

    @GetMapping({"/", "/api"})
    public ResponseEntity<Map<String, Object>> getApiIndex() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "ERE-TN Backend REST API");
        response.put("version", "2.1");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Welcome to ERE-TN API — Discover. Apply. Achieve.");
        response.put("frontendUrl", "http://localhost:5173");

        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("health", "GET /api/health");
        endpoints.put("opportunities", "GET /api/opportunities");
        endpoints.put("opportunityDetail", "GET /api/opportunities/{id}");
        endpoints.put("providers", "GET /api/providers");
        endpoints.put("institutions", "GET /api/institutions");
        endpoints.put("mentors", "GET /api/mentors");
        endpoints.put("meetings", "GET /api/meetings");
        endpoints.put("futureTalks", "GET /api/future-talks");
        endpoints.put("courses", "GET /api/courses");
        endpoints.put("eligibilityCheck", "POST /api/eligibility/check");
        endpoints.put("novaAiChat", "POST /api/nova/chat");
        endpoints.put("authLogin", "POST /api/auth/login");
        endpoints.put("authRegister", "POST /api/auth/register");
        endpoints.put("adminOpportunities", "POST/PUT/DELETE /api/admin/opportunities");
        endpoints.put("savedOpportunities", "GET/POST/DELETE /api/saved-opportunities");

        response.put("publicEndpoints", endpoints);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "ERE-TN Backend");
        response.put("version", "2.1");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("database", "CONNECTED");
        response.put("totalOpportunities", opportunityRepository.count());
        return ResponseEntity.ok(response);
    }
}

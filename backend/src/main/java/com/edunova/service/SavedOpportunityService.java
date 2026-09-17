package com.edunova.service;

import com.edunova.domain.entity.Opportunity;
import com.edunova.domain.entity.SavedOpportunity;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.OpportunityDtos.OpportunityResponse;
import com.edunova.repository.OpportunityRepository;
import com.edunova.repository.SavedOpportunityRepository;
import com.edunova.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedOpportunityService {

    private final SavedOpportunityRepository savedOpportunityRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserAccountRepository userRepository;
    private final OpportunityService opportunityService;

    @Transactional(readOnly = true)
    public List<OpportunityResponse> getSavedOpportunities(UUID userId) {
        return savedOpportunityRepository.findByUserId(userId)
                .stream()
                .map(s -> opportunityService.mapToResponse(s.getOpportunity()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveOpportunity(UUID userId, String opportunityId) {
        if (!savedOpportunityRepository.existsByUserIdAndOpportunityId(userId, opportunityId)) {
            UserAccount user = userRepository.findById(userId).orElseThrow();
            Opportunity opp = opportunityRepository.findById(opportunityId).orElseThrow();

            SavedOpportunity saved = SavedOpportunity.builder()
                    .user(user)
                    .opportunity(opp)
                    .build();
            savedOpportunityRepository.save(saved);
        }
    }

    @Transactional
    public void removeSavedOpportunity(UUID userId, String opportunityId) {
        savedOpportunityRepository.findByUserId(userId).stream()
                .filter(s -> s.getOpportunity().getId().equals(opportunityId))
                .findFirst()
                .ifPresent(savedOpportunityRepository::delete);
    }
}

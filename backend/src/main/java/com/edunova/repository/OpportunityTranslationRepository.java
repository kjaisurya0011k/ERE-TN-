package com.edunova.repository;

import com.edunova.domain.entity.OpportunityTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OpportunityTranslationRepository extends JpaRepository<OpportunityTranslation, Long> {
    Optional<OpportunityTranslation> findByOpportunityIdAndLanguageCode(String opportunityId, String languageCode);
    List<OpportunityTranslation> findByOpportunityId(String opportunityId);
}

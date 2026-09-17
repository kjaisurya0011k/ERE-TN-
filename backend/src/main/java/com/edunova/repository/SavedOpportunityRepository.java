package com.edunova.repository;

import com.edunova.domain.entity.Opportunity;
import com.edunova.domain.entity.SavedOpportunity;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedOpportunityRepository extends JpaRepository<SavedOpportunity, UUID> {
    List<SavedOpportunity> findByUser(UserAccount user);
    List<SavedOpportunity> findByUserId(UUID userId);
    Optional<SavedOpportunity> findByUserAndOpportunity(UserAccount user, Opportunity opportunity);
    boolean existsByUserIdAndOpportunityId(UUID userId, String opportunityId);
    void deleteByUserIdAndOpportunityId(UUID userId, String opportunityId);
}

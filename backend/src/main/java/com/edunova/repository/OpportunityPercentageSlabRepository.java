package com.edunova.repository;

import com.edunova.domain.entity.OpportunityPercentageSlab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OpportunityPercentageSlabRepository extends JpaRepository<OpportunityPercentageSlab, Long> {
    List<OpportunityPercentageSlab> findByOpportunityIdOrderBySortOrderAsc(String opportunityId);
    void deleteByOpportunityId(String opportunityId);
}

package com.edunova.repository;

import com.edunova.domain.entity.OpportunityCutoffSlab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OpportunityCutoffSlabRepository extends JpaRepository<OpportunityCutoffSlab, Long> {
    List<OpportunityCutoffSlab> findByOpportunityIdOrderBySortOrderAsc(String opportunityId);
    void deleteByOpportunityId(String opportunityId);
}

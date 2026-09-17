package com.edunova.repository;

import com.edunova.domain.OpportunityType;
import com.edunova.domain.VerificationStatus;
import com.edunova.domain.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, String> {
    List<Opportunity> findByOpportunityType(OpportunityType opportunityType);
    List<Opportunity> findByInstitutionId(String institutionId);
    List<Opportunity> findByProviderId(String providerId);
    List<Opportunity> findByFeaturedTrue();

    @Query("SELECT o FROM Opportunity o WHERE " +
           "(:query IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(o.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(o.provider.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(o.institutionName) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:oppType IS NULL OR o.opportunityType = :oppType) " +
           "AND (:state IS NULL OR o.state = :state OR o.state = 'All India') " +
           "AND (:verification IS NULL OR o.verificationStatus = :verification)")
    List<Opportunity> searchAndFilter(
            @Param("query") String query,
            @Param("oppType") OpportunityType oppType,
            @Param("state") String state,
            @Param("verification") VerificationStatus verification);
}

package com.edunova.repository;

import com.edunova.domain.ProviderType;
import com.edunova.domain.entity.Institution;
import com.edunova.domain.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, String> {
    List<Institution> findByStateIgnoreCase(String state);
}

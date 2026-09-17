package com.edunova.repository;

import com.edunova.domain.entity.ProviderTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderTranslationRepository extends JpaRepository<ProviderTranslation, Long> {
    Optional<ProviderTranslation> findByProviderIdAndLanguageCode(String providerId, String languageCode);
}

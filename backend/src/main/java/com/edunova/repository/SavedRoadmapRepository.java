package com.edunova.repository;

import com.edunova.domain.entity.SavedRoadmap;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SavedRoadmapRepository extends JpaRepository<SavedRoadmap, UUID> {
    List<SavedRoadmap> findByUserOrderByCreatedAtDesc(UserAccount user);
    List<SavedRoadmap> findByUserIdOrderByCreatedAtDesc(UUID userId);
}

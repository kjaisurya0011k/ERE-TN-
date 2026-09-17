package com.edunova.repository;

import com.edunova.domain.MentorVerificationStatus;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, UUID> {
    Optional<MentorProfile> findByUser(UserAccount user);
    Optional<MentorProfile> findByUserId(UUID userId);
    List<MentorProfile> findByVerificationStatus(MentorVerificationStatus status);
}

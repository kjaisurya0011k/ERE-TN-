package com.edunova.repository;

import com.edunova.domain.MentorVerificationStatus;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.domain.entity.StudentProfile;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {
    Optional<StudentProfile> findByUser(UserAccount user);
    Optional<StudentProfile> findByUserId(UUID userId);
}

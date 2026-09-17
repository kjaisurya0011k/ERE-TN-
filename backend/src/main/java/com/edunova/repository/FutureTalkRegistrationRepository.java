package com.edunova.repository;

import com.edunova.domain.entity.FutureTalk;
import com.edunova.domain.entity.FutureTalkRegistration;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FutureTalkRegistrationRepository extends JpaRepository<FutureTalkRegistration, UUID> {
    List<FutureTalkRegistration> findByUser(UserAccount user);
    List<FutureTalkRegistration> findByUserId(UUID userId);
    List<FutureTalkRegistration> findByTalk(FutureTalk talk);
    List<FutureTalkRegistration> findByTalkId(String talkId);
    Optional<FutureTalkRegistration> findByTalkIdAndUserId(String talkId, UUID userId);
    boolean existsByTalkIdAndUserId(String talkId, UUID userId);
}

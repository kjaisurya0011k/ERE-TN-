package com.edunova.repository;

import com.edunova.domain.entity.NovaConversation;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NovaConversationRepository extends JpaRepository<NovaConversation, UUID> {
    List<NovaConversation> findByUserOrderByUpdatedAtDesc(UserAccount user);
    List<NovaConversation> findByUserIdOrderByUpdatedAtDesc(UUID userId);
    List<NovaConversation> findBySessionTokenOrderByUpdatedAtDesc(String sessionToken);
    Optional<NovaConversation> findByIdAndUserId(UUID id, UUID userId);
}

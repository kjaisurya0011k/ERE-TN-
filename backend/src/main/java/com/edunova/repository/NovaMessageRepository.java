package com.edunova.repository;

import com.edunova.domain.entity.NovaConversation;
import com.edunova.domain.entity.NovaMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NovaMessageRepository extends JpaRepository<NovaMessage, UUID> {
    List<NovaMessage> findByConversationOrderByCreatedAtAsc(NovaConversation conversation);
    List<NovaMessage> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);
}

package com.edunova.repository;

import com.edunova.domain.entity.ChatConversation;
import com.edunova.domain.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByConversationOrderByCreatedAtAsc(ChatConversation conversation);
    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);
}

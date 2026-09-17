package com.edunova.repository;

import com.edunova.domain.entity.ChatConversation;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, UUID> {
    List<ChatConversation> findByStudentOrMentor(UserAccount student, UserAccount mentor);
    List<ChatConversation> findByStudentIdOrMentorId(UUID studentId, UUID mentorId);
    Optional<ChatConversation> findByStudentIdAndMentorId(UUID studentId, UUID mentorId);
}

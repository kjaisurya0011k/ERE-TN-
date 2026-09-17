package com.edunova.service;

import com.edunova.domain.UserRole;
import com.edunova.domain.entity.ChatConversation;
import com.edunova.domain.entity.ChatMessage;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.ChatDtos.*;
import com.edunova.repository.ChatConversationRepository;
import com.edunova.repository.ChatMessageRepository;
import com.edunova.repository.MentorProfileRepository;
import com.edunova.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UserAccountRepository userRepository;
    private final MentorProfileRepository mentorProfileRepository;

    @Transactional(readOnly = true)
    public List<ConversationResponse> getUserConversations(UUID currentUserId) {
        UserAccount currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return conversationRepository.findByStudentOrMentor(currentUser, currentUser)
                .stream()
                .map(conv -> mapToConversationResponse(conv, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(UUID conversationId, UUID currentUserId) {
        ChatConversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!conv.getStudent().getId().equals(currentUserId) && !conv.getMentor().getId().equals(currentUserId)) {
            throw new IllegalStateException("Access denied: You are not a participant in this conversation.");
        }

        return messageRepository.findByConversationOrderByCreatedAtAsc(conv)
                .stream()
                .map(msg -> ChatMessageResponse.builder()
                        .id(msg.getId())
                        .conversationId(conv.getId())
                        .senderId(msg.getSender().getId())
                        .senderName(msg.getSender().getFullName())
                        .body(msg.getBody())
                        .readAt(msg.getReadAt())
                        .createdAt(msg.getCreatedAt())
                        .isFromCurrentUser(msg.getSender().getId().equals(currentUserId))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatMessageResponse sendMessage(UUID currentUserId, ChatMessageRequest request) {
        UserAccount sender = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        UserAccount recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

        UserAccount student = sender.getRole() == UserRole.STUDENT ? sender : recipient;
        UserAccount mentor = sender.getRole() == UserRole.MENTOR ? sender : recipient;

        ChatConversation conv = conversationRepository.findByStudentIdAndMentorId(student.getId(), mentor.getId())
                .orElseGet(() -> {
                    ChatConversation newConv = ChatConversation.builder()
                            .student(student)
                            .mentor(mentor)
                            .build();
                    return conversationRepository.save(newConv);
                });

        ChatMessage msg = ChatMessage.builder()
                .conversation(conv)
                .sender(sender)
                .body(request.getBody())
                .build();

        msg = messageRepository.save(msg);

        return ChatMessageResponse.builder()
                .id(msg.getId())
                .conversationId(conv.getId())
                .senderId(sender.getId())
                .senderName(sender.getFullName())
                .body(msg.getBody())
                .createdAt(msg.getCreatedAt())
                .isFromCurrentUser(true)
                .build();
    }

    private ConversationResponse mapToConversationResponse(ChatConversation conv, UUID currentUserId) {
        UserAccount other = conv.getStudent().getId().equals(currentUserId) ? conv.getMentor() : conv.getStudent();

        String avatar = null;
        if (other.getRole() == UserRole.MENTOR) {
            avatar = mentorProfileRepository.findByUserId(other.getId())
                    .map(MentorProfile::getAvatarUrl)
                    .orElse(null);
        }

        List<ChatMessage> messages = messageRepository.findByConversationOrderByCreatedAtAsc(conv);
        String lastMessage = "No messages yet";
        OffsetDateTime lastTime = conv.getCreatedAt();
        if (!messages.isEmpty()) {
            ChatMessage last = messages.get(messages.size() - 1);
            lastMessage = last.getBody();
            lastTime = last.getCreatedAt();
        }

        return ConversationResponse.builder()
                .id(conv.getId())
                .otherUserId(other.getId())
                .otherUserName(other.getFullName())
                .otherUserRole(other.getRole().name())
                .otherUserAvatar(avatar)
                .lastMessage(lastMessage)
                .lastMessageTime(lastTime)
                .unreadCount(0)
                .build();
    }
}

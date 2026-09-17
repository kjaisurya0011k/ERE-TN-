package com.edunova.service;

import com.edunova.domain.entity.FutureTalk;
import com.edunova.domain.entity.FutureTalkRegistration;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.FutureTalkDtos.FutureTalkResponse;
import com.edunova.repository.FutureTalkRegistrationRepository;
import com.edunova.repository.FutureTalkRepository;
import com.edunova.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FutureTalkService {

    private final FutureTalkRepository futureTalkRepository;
    private final FutureTalkRegistrationRepository registrationRepository;
    private final UserAccountRepository userRepository;

    @Transactional(readOnly = true)
    public List<FutureTalkResponse> getAllTalks(UUID currentUserId) {
        return futureTalkRepository.findAll().stream()
                .map(t -> mapToResponse(t, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FutureTalkResponse getTalkById(String id, UUID currentUserId) {
        FutureTalk talk = futureTalkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Future Talk not found: " + id));
        return mapToResponse(talk, currentUserId);
    }

    @Transactional
    public FutureTalkResponse registerForTalk(String talkId, UUID currentUserId) {
        FutureTalk talk = futureTalkRepository.findById(talkId)
                .orElseThrow(() -> new IllegalArgumentException("Future Talk not found: " + talkId));

        UserAccount user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!registrationRepository.existsByTalkIdAndUserId(talkId, currentUserId)) {
            FutureTalkRegistration reg = FutureTalkRegistration.builder()
                    .talk(talk)
                    .user(user)
                    .build();
            registrationRepository.save(reg);
        }

        return mapToResponse(talk, currentUserId);
    }

    private FutureTalkResponse mapToResponse(FutureTalk t, UUID currentUserId) {
        boolean isReg = false;
        if (currentUserId != null) {
            isReg = registrationRepository.existsByTalkIdAndUserId(t.getId(), currentUserId);
        }

        long count = registrationRepository.findByTalk(t).size();

        return FutureTalkResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .speakerName(t.getSpeakerName())
                .speakerRole(t.getSpeakerRole())
                .speakerCompany(t.getSpeakerCompany())
                .speakerAvatarUrl(t.getSpeakerAvatarUrl())
                .topicDomain(t.getTopicDomain())
                .talkDate(t.getTalkDate())
                .talkTime(t.getTalkTime())
                .durationMinutes(t.getDurationMinutes())
                .description(t.getDescription())
                .maxParticipants(t.getMaxParticipants())
                .registeredCount(count)
                .meetingLink(t.getMeetingLink())
                .status(t.getStatus())
                .isUserRegistered(isReg)
                .build();
    }
}

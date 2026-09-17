package com.edunova.service;

import com.edunova.domain.MeetingPlatform;
import com.edunova.domain.MeetingRegistrationStatus;
import com.edunova.domain.MeetingStatus;
import com.edunova.domain.MeetingType;
import com.edunova.domain.entity.Meeting;
import com.edunova.domain.entity.MeetingRegistration;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.MeetingDtos.*;
import com.edunova.repository.MeetingRegistrationRepository;
import com.edunova.repository.MeetingRepository;
import com.edunova.repository.MentorProfileRepository;
import com.edunova.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingRegistrationRepository meetingRegistrationRepository;
    private final UserAccountRepository userRepository;
    private final MentorProfileRepository mentorProfileRepository;

    // ── Student: approved upcoming sessions ──────────────────────────────────

    @Transactional(readOnly = true)
    public List<MeetingResponse> getApprovedUpcomingMeetings(UUID currentUserId) {
        LocalDate today = LocalDate.now();
        return meetingRepository.findUpcomingApprovedMeetings(today)
                .stream()
                .map(m -> mapToResponse(m, currentUserId))
                .collect(Collectors.toList());
    }

    // ── Student: their registered sessions ───────────────────────────────────

    @Transactional(readOnly = true)
    public List<MeetingResponse> getStudentRegisteredMeetings(UUID studentUserId) {
        UserAccount user = userRepository.findById(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return meetingRegistrationRepository.findByUser(user)
                .stream()
                .filter(reg -> reg.getStatus() == MeetingRegistrationStatus.REGISTERED)
                .map(reg -> mapToResponse(reg.getMeeting(), studentUserId))
                .collect(Collectors.toList());
    }

    // ── Mentor: their own sessions ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<MeetingResponse> getMentorMeetings(UUID mentorUserId) {
        return meetingRepository.findByMentorId(mentorUserId)
                .stream()
                .map(m -> mapToResponse(m, mentorUserId))
                .collect(Collectors.toList());
    }

    // ── By ID ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public MeetingResponse getMeetingById(UUID meetingId, UUID currentUserId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with ID: " + meetingId));
        return mapToResponse(meeting, currentUserId);
    }

    // ── Create session (mentor) ───────────────────────────────────────────────

    @Transactional
    public MeetingResponse createMeeting(UUID mentorUserId, MeetingCreateRequest request) {
        UserAccount mentor = userRepository.findById(mentorUserId)
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));

        // Validate: EXTERNAL_URL platform requires a real HTTPS URL
        MeetingPlatform platform = request.getMeetingPlatform() != null
                ? request.getMeetingPlatform() : MeetingPlatform.BUILT_IN_WEBRTC;

        if (platform == MeetingPlatform.EXTERNAL_URL) {
            String url = request.getMeetingUrl();
            if (url == null || url.isBlank()) {
                throw new IllegalArgumentException(
                        "A valid HTTPS meeting URL is required when platform is EXTERNAL_URL.");
            }
            if (!url.startsWith("https://")) {
                throw new IllegalArgumentException(
                        "Meeting URL must start with https://");
            }
        }

        if (platform == MeetingPlatform.ZOOM_FUTURE) {
            throw new IllegalArgumentException(
                    "Zoom integration is not yet configured. Please use EXTERNAL_URL or BUILT_IN_WEBRTC.");
        }

        // Validate: end time must be after start time
        if (request.getEndTime() != null && request.getStartTime() != null
                && !request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        String roomCode = "room-" + UUID.randomUUID().toString().substring(0, 8);

        Meeting meeting = Meeting.builder()
                .mentor(mentor)
                .title(request.getTitle())
                .description(request.getDescription())
                .topic(request.getTopic())
                .meetingType(request.getMeetingType() != null ? request.getMeetingType() : MeetingType.CAREER_GUIDANCE)
                .meetingDate(request.getMeetingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxParticipants(request.getMaxParticipants() != null ? request.getMaxParticipants() : 50)
                .language(request.getLanguage() != null ? request.getLanguage() : "English")
                .targetAudience(request.getTargetAudience())
                .educationLevel(request.getEducationLevel())
                .careerCategory(request.getCareerCategory())
                .meetingAgenda(request.getMeetingAgenda())
                .meetingPlatform(platform)
                .meetingUrl(request.getMeetingUrl())
                .notes(request.getNotes())
                .status(MeetingStatus.PENDING_APPROVAL) // Always requires Admin Review
                .roomCode(roomCode)
                .build();

        meeting = meetingRepository.save(meeting);
        // Return with full URL visible to the mentor who just created it
        return mapToResponse(meeting, mentorUserId);
    }

    // ── Update/Resubmit session (mentor — only their own rejected sessions) ───

    @Transactional
    public MeetingResponse updateAndResubmit(UUID meetingId, UUID mentorUserId, MeetingCreateRequest request) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (!meeting.getMentor().getId().equals(mentorUserId)) {
            throw new IllegalStateException("You can only edit your own sessions.");
        }
        if (meeting.getStatus() != MeetingStatus.REJECTED && meeting.getStatus() != MeetingStatus.DRAFT) {
            throw new IllegalStateException("Only REJECTED or DRAFT sessions can be edited and resubmitted.");
        }

        MeetingPlatform platform = request.getMeetingPlatform() != null
                ? request.getMeetingPlatform() : meeting.getMeetingPlatform();

        if (platform == MeetingPlatform.EXTERNAL_URL) {
            String url = request.getMeetingUrl();
            if (url == null || url.isBlank() || !url.startsWith("https://")) {
                throw new IllegalArgumentException("A valid HTTPS meeting URL is required for EXTERNAL_URL platform.");
            }
        }

        if (request.getEndTime() != null && request.getStartTime() != null
                && !request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        // Apply updates
        meeting.setTitle(request.getTitle());
        meeting.setDescription(request.getDescription());
        meeting.setTopic(request.getTopic());
        if (request.getMeetingType() != null) meeting.setMeetingType(request.getMeetingType());
        meeting.setMeetingDate(request.getMeetingDate());
        meeting.setStartTime(request.getStartTime());
        meeting.setEndTime(request.getEndTime());
        if (request.getMaxParticipants() != null) meeting.setMaxParticipants(request.getMaxParticipants());
        if (request.getLanguage() != null) meeting.setLanguage(request.getLanguage());
        meeting.setTargetAudience(request.getTargetAudience());
        meeting.setMeetingAgenda(request.getMeetingAgenda());
        meeting.setMeetingPlatform(platform);
        meeting.setMeetingUrl(request.getMeetingUrl());
        meeting.setNotes(request.getNotes());

        // Clear previous rejection reason and resubmit for approval
        meeting.setRejectionReason(null);
        meeting.setStatus(MeetingStatus.PENDING_APPROVAL);

        meeting = meetingRepository.save(meeting);
        return mapToResponse(meeting, mentorUserId);
    }

    // ── Student: register for session ─────────────────────────────────────────

    @Transactional
    public MeetingResponse registerForMeeting(UUID meetingId, UUID studentUserId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found"));

        if (meeting.getStatus() != MeetingStatus.APPROVED) {
            throw new IllegalStateException("Cannot register for a meeting that is not approved.");
        }

        long currentCount = meetingRegistrationRepository.countByMeetingIdAndStatus(meetingId, MeetingRegistrationStatus.REGISTERED);
        if (currentCount >= meeting.getMaxParticipants()) {
            throw new IllegalStateException("Sorry, this meeting is already full.");
        }

        UserAccount student = userRepository.findById(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        MeetingRegistration reg = meetingRegistrationRepository.findByMeetingIdAndUserId(meetingId, studentUserId)
                .orElseGet(() -> MeetingRegistration.builder().meeting(meeting).user(student).build());

        reg.setStatus(MeetingRegistrationStatus.REGISTERED);
        meetingRegistrationRepository.save(reg);

        return mapToResponse(meeting, studentUserId);
    }

    // ── Student: cancel registration ──────────────────────────────────────────

    @Transactional
    public MeetingResponse cancelRegistration(UUID meetingId, UUID studentUserId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found"));

        meetingRegistrationRepository.findByMeetingIdAndUserId(meetingId, studentUserId)
                .ifPresent(reg -> {
                    reg.setStatus(MeetingRegistrationStatus.CANCELLED);
                    meetingRegistrationRepository.save(reg);
                });

        return mapToResponse(meeting, studentUserId);
    }

    // ── WebRTC room details ───────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public MeetingRoomResponse getMeetingRoomDetails(String roomCode, UUID currentUserId) {
        Meeting meeting = meetingRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Meeting room not found"));

        UserAccount currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean isHost = meeting.getMentor().getId().equals(currentUserId);

        return MeetingRoomResponse.builder()
                .meetingId(meeting.getId())
                .title(meeting.getTitle())
                .topic(meeting.getTopic())
                .roomCode(meeting.getRoomCode())
                .mentorName(meeting.getMentor().getFullName())
                .currentUserId(currentUser.getId())
                .currentUserName(currentUser.getFullName())
                .currentUserRole(currentUser.getRole().name())
                .isHost(isHost)
                .meetingDate(meeting.getMeetingDate())
                .startTime(meeting.getStartTime())
                .endTime(meeting.getEndTime())
                .status(meeting.getStatus())
                .build();
    }

    // ── Shared response mapper ────────────────────────────────────────────────

    /**
     * Maps a Meeting entity to a DTO.
     *
     * Security: meetingUrl is included ONLY when:
     *   - currentUserId matches the session mentor (host), OR
     *   - currentUserId is registered for the session (REGISTERED status).
     * Admin access is handled by AdminService which calls this with null and then sets the URL manually.
     */
    public MeetingResponse mapToResponse(Meeting m, UUID currentUserId) {
        long registeredCount = meetingRegistrationRepository.countByMeetingIdAndStatus(m.getId(), MeetingRegistrationStatus.REGISTERED);
        int max = m.getMaxParticipants() != null ? m.getMaxParticipants() : 50;
        int seatsAvailable = Math.max(0, max - (int) registeredCount);

        boolean isUserRegistered = false;
        boolean isHost = false;
        if (currentUserId != null) {
            isUserRegistered = meetingRegistrationRepository.existsByMeetingIdAndUserIdAndStatus(
                    m.getId(), currentUserId, MeetingRegistrationStatus.REGISTERED);
            isHost = m.getMentor().getId().equals(currentUserId);
        }

        // Only expose the meeting URL to the host or a registered participant
        String exposedUrl = null;
        if (isHost || isUserRegistered) {
            exposedUrl = m.getMeetingUrl();
        }

        String mentorRole = "Industry Mentor";
        String avatar = null;
        var profileOpt = mentorProfileRepository.findByUserId(m.getMentor().getId());
        if (profileOpt.isPresent()) {
            MentorProfile mp = profileOpt.get();
            if (mp.getTitleRole() != null) mentorRole = mp.getTitleRole();
            avatar = mp.getAvatarUrl();
        }

        return MeetingResponse.builder()
                .id(m.getId())
                .mentorId(m.getMentor().getId())
                .mentorName(m.getMentor().getFullName())
                .mentorRole(mentorRole)
                .mentorAvatarUrl(avatar)
                .title(m.getTitle())
                .description(m.getDescription())
                .topic(m.getTopic())
                .meetingType(m.getMeetingType())
                .meetingDate(m.getMeetingDate())
                .startTime(m.getStartTime())
                .endTime(m.getEndTime())
                .maxParticipants(m.getMaxParticipants())
                .registeredCount(registeredCount)
                .seatsAvailable(seatsAvailable)
                .language(m.getLanguage())
                .targetAudience(m.getTargetAudience())
                .educationLevel(m.getEducationLevel())
                .careerCategory(m.getCareerCategory())
                .meetingAgenda(m.getMeetingAgenda())
                .status(m.getStatus())
                .rejectionReason(m.getRejectionReason())
                .roomCode(m.getRoomCode())
                .isUserRegistered(isUserRegistered)
                .createdAt(m.getCreatedAt())
                .meetingPlatform(m.getMeetingPlatform())
                .meetingUrl(exposedUrl)
                .approvedBy(m.getApprovedBy())
                .approvedAt(m.getApprovedAt())
                .build();
    }

    /**
     * Admin-privileged mapper that always includes the meeting URL.
     * Only called from AdminService.
     */
    public MeetingResponse mapToResponseAsAdmin(Meeting m) {
        MeetingResponse r = mapToResponse(m, m.getMentor().getId()); // host-level access
        r.setMeetingUrl(m.getMeetingUrl()); // ensure URL always present for admin
        return r;
    }
}

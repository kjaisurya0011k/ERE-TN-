package com.edunova.service;

import com.edunova.domain.MeetingStatus;
import com.edunova.domain.MentorVerificationStatus;
import com.edunova.domain.NotificationType;
import com.edunova.domain.UserRole;
import com.edunova.domain.UserStatus;
import com.edunova.domain.entity.Meeting;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.dto.MeetingDtos.MeetingApprovalRequest;
import com.edunova.dto.MeetingDtos.MeetingResponse;
import com.edunova.dto.MentorDtos.MentorApprovalRequest;
import com.edunova.dto.MentorDtos.MentorProfileResponse;
import com.edunova.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MentorProfileRepository mentorProfileRepository;
    private final MeetingRepository meetingRepository;
    private final UserAccountRepository userRepository;
    private final OpportunityRepository opportunityRepository;
    private final ProviderRepository providerRepository;
    private final InstitutionRepository institutionRepository;
    private final MentorService mentorService;
    private final MeetingService meetingService;
    private final NotificationService notificationService;

    // ── Mentor management ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<MentorProfileResponse> getPendingMentors() {
        return mentorProfileRepository.findByVerificationStatus(MentorVerificationStatus.PENDING)
                .stream()
                .map(mentorService::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MentorProfileResponse> getAllMentors() {
        return mentorProfileRepository.findAll()
                .stream()
                .map(mentorService::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MentorProfileResponse updateMentorStatus(UUID mentorId, MentorApprovalRequest request) {
        MentorProfile profile = mentorProfileRepository.findById(mentorId)
                .or(() -> mentorProfileRepository.findByUserId(mentorId))
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));

        profile.setVerificationStatus(request.getStatus());

        if (request.getStatus() == MentorVerificationStatus.APPROVED) {
            profile.getUser().setStatus(UserStatus.ACTIVE);
        } else if (request.getStatus() == MentorVerificationStatus.REJECTED) {
            profile.getUser().setStatus(UserStatus.DISABLED);
        }

        userRepository.save(profile.getUser());
        profile = mentorProfileRepository.save(profile);

        return mentorService.mapToResponse(profile);
    }

    // ── Session (meeting) management ──────────────────────────────────────────

    /** All sessions — for admin "all sessions" view. */
    @Transactional(readOnly = true)
    public List<MeetingResponse> getAllMeetings() {
        return meetingRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(meetingService::mapToResponseAsAdmin)
                .collect(Collectors.toList());
    }

    /** Pending sessions awaiting admin review. */
    @Transactional(readOnly = true)
    public List<MeetingResponse> getPendingMeetings() {
        return meetingRepository.findByStatusOrderByCreatedAtDesc(MeetingStatus.PENDING_APPROVAL)
                .stream()
                .map(meetingService::mapToResponseAsAdmin)
                .collect(Collectors.toList());
    }

    /**
     * Approve or reject a session.
     * Fires a notification to the mentor in both cases.
     */
    @Transactional
    public MeetingResponse updateMeetingStatus(UUID meetingId, UUID adminUserId, MeetingApprovalRequest request) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found"));

        // Validate rejection has a reason
        if (request.getStatus() == MeetingStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                throw new IllegalArgumentException("A rejection reason is required.");
            }
            meeting.setRejectionReason(request.getRejectionReason());
        }

        if (request.getStatus() == MeetingStatus.APPROVED) {
            meeting.setApprovedBy(adminUserId);
            meeting.setApprovedAt(OffsetDateTime.now());
            meeting.setRejectionReason(null); // clear any prior rejection
        }

        meeting.setStatus(request.getStatus());
        meeting = meetingRepository.save(meeting);

        // ── Notify the mentor ────────────────────────────────────────────────
        UUID mentorUserId = meeting.getMentor().getId();

        if (request.getStatus() == MeetingStatus.APPROVED) {
            notificationService.createNotification(
                    mentorUserId,
                    "Session Approved ✅",
                    "Your session \"" + meeting.getTitle() + "\" has been approved and is now visible to students.",
                    NotificationType.MEETING,
                    "/mentor/dashboard"
            );
        } else if (request.getStatus() == MeetingStatus.REJECTED) {
            notificationService.createNotification(
                    mentorUserId,
                    "Session Requires Changes",
                    "Your session \"" + meeting.getTitle() + "\" was not approved. Reason: " + request.getRejectionReason()
                            + ". You can edit and resubmit.",
                    NotificationType.MEETING,
                    "/mentor/dashboard"
            );
        }

        return meetingService.mapToResponseAsAdmin(meeting);
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", userRepository.findByRole(UserRole.STUDENT).size());
        stats.put("totalMentors", mentorProfileRepository.count());
        stats.put("pendingMentors", mentorProfileRepository.findByVerificationStatus(MentorVerificationStatus.PENDING).size());
        stats.put("approvedMentors", mentorProfileRepository.findByVerificationStatus(MentorVerificationStatus.APPROVED).size());
        stats.put("totalOpportunities", opportunityRepository.count());
        stats.put("totalProviders", providerRepository.count());
        stats.put("totalInstitutions", institutionRepository.count());
        stats.put("pendingMeetings", meetingRepository.findByStatus(MeetingStatus.PENDING_APPROVAL).size());
        stats.put("approvedMeetings", meetingRepository.findByStatus(MeetingStatus.APPROVED).size());
        return stats;
    }
}

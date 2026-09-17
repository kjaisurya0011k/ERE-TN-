package com.edunova.service;

import com.edunova.domain.SessionStatus;
import com.edunova.domain.SessionType;
import com.edunova.domain.entity.CounsellingSession;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.CounsellingDtos.CounsellingBookingRequest;
import com.edunova.dto.CounsellingDtos.CounsellingResponse;
import com.edunova.repository.CounsellingSessionRepository;
import com.edunova.repository.MentorProfileRepository;
import com.edunova.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CounsellingService {

    private final CounsellingSessionRepository counsellingSessionRepository;
    private final UserAccountRepository userRepository;
    private final MentorProfileRepository mentorProfileRepository;

    @Transactional
    public CounsellingResponse bookSession(UUID studentUserId, CounsellingBookingRequest request) {
        UserAccount student = userRepository.findById(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        UserAccount mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));

        // Check for double booking
        boolean conflict = counsellingSessionRepository.existsByMentorIdAndSessionDateAndStartTimeAndStatusNot(
                mentor.getId(), request.getSessionDate(), request.getStartTime(), SessionStatus.CANCELLED
        );
        if (conflict) {
            throw new IllegalStateException("Mentor is already booked for this date and time slot. Please select another slot.");
        }

        CounsellingSession session = CounsellingSession.builder()
                .student(student)
                .mentor(mentor)
                .sessionDate(request.getSessionDate())
                .startTime(request.getStartTime())
                .sessionType(request.getSessionType() != null ? request.getSessionType() : SessionType.CAREER)
                .status(SessionStatus.REQUESTED)
                .notes(request.getNotes())
                .build();

        session = counsellingSessionRepository.save(session);
        return mapToResponse(session);
    }

    @Transactional(readOnly = true)
    public List<CounsellingResponse> getStudentSessions(UUID studentUserId) {
        return counsellingSessionRepository.findByStudentId(studentUserId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CounsellingResponse> getMentorSessions(UUID mentorUserId) {
        return counsellingSessionRepository.findByMentorId(mentorUserId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CounsellingResponse updateSessionStatus(UUID sessionId, UUID mentorUserId, SessionStatus status) {
        CounsellingSession session = counsellingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (!session.getMentor().getId().equals(mentorUserId)) {
            throw new IllegalStateException("Only the assigned mentor can update session status.");
        }

        session.setStatus(status);
        session = counsellingSessionRepository.save(session);
        return mapToResponse(session);
    }

    private CounsellingResponse mapToResponse(CounsellingSession s) {
        String title = "Industry Mentor";
        String avatar = null;
        var pOpt = mentorProfileRepository.findByUserId(s.getMentor().getId());
        if (pOpt.isPresent()) {
            MentorProfile mp = pOpt.get();
            if (mp.getTitleRole() != null) title = mp.getTitleRole();
            avatar = mp.getAvatarUrl();
        }

        return CounsellingResponse.builder()
                .id(s.getId())
                .studentId(s.getStudent().getId())
                .studentName(s.getStudent().getFullName())
                .studentEmail(s.getStudent().getEmail())
                .mentorId(s.getMentor().getId())
                .mentorName(s.getMentor().getFullName())
                .mentorTitle(title)
                .mentorAvatarUrl(avatar)
                .sessionDate(s.getSessionDate())
                .startTime(s.getStartTime())
                .sessionType(s.getSessionType())
                .status(s.getStatus())
                .notes(s.getNotes())
                .createdAt(s.getCreatedAt())
                .build();
    }
}

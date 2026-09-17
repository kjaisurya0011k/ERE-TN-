package com.edunova.service;

import com.edunova.domain.MeetingStatus;
import com.edunova.domain.MentorVerificationStatus;
import com.edunova.domain.SessionStatus;
import com.edunova.domain.entity.MentorAvailability;
import com.edunova.domain.entity.MentorProfile;
import com.edunova.domain.entity.UserAccount;
import com.edunova.dto.MentorDtos.*;
import com.edunova.repository.CounsellingSessionRepository;
import com.edunova.repository.MeetingRepository;
import com.edunova.repository.MentorProfileRepository;
import com.edunova.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final MentorProfileRepository mentorProfileRepository;
    private final UserAccountRepository userRepository;
    private final CounsellingSessionRepository counsellingSessionRepository;
    private final MeetingRepository meetingRepository;

    @Transactional(readOnly = true)
    public List<MentorProfileResponse> getApprovedMentors() {
        return mentorProfileRepository.findByVerificationStatus(MentorVerificationStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MentorProfileResponse getMentorById(UUID mentorId) {
        MentorProfile profile = mentorProfileRepository.findById(mentorId)
                .or(() -> mentorProfileRepository.findByUserId(mentorId))
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));

        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public MentorProfileResponse getMentorProfileByUserId(UUID userId) {
        MentorProfile profile = mentorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Mentor profile not found for user: " + userId));
        return mapToResponse(profile);
    }

    @Transactional
    public MentorProfileResponse updateMentorProfile(UUID userId, MentorProfileResponse request) {
        MentorProfile profile = mentorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Mentor profile not found"));

        if (request.getTitleRole() != null) profile.setTitleRole(request.getTitleRole());
        if (request.getCompanyOrInstitution() != null) profile.setCompanyOrInstitution(request.getCompanyOrInstitution());
        if (request.getQualification() != null) profile.setQualification(request.getQualification());
        if (request.getYearsOfExperience() != null) profile.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getSpecialization() != null) profile.setSpecialization(request.getSpecialization());
        if (request.getHourlyRate() != null) profile.setHourlyRate(request.getHourlyRate());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());

        if (request.getLanguagesSpoken() != null) {
            profile.setLanguagesSpoken(new HashSet<>(request.getLanguagesSpoken()));
        }
        if (request.getExpertiseTags() != null) {
            profile.setExpertiseTags(new HashSet<>(request.getExpertiseTags()));
        }

        profile = mentorProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    @Transactional
    public MentorProfileResponse setAvailability(UUID userId, List<AvailabilitySlotDto> slots) {
        MentorProfile profile = mentorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Mentor profile not found"));

        profile.getAvailabilities().clear();

        if (slots != null) {
            for (AvailabilitySlotDto slot : slots) {
                if (slot.getStartTime() == null || slot.getEndTime() == null) continue;
                MentorAvailability av = MentorAvailability.builder()
                        .mentorProfile(profile)
                        .weekday(slot.getResolvedWeekday())
                        .startTime(slot.getStartTime())
                        .endTime(slot.getEndTime())
                        .build();
                profile.getAvailabilities().add(av);
            }
        }

        profile = mentorProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public MentorStatsDto getMentorStats(UUID userId) {
        var sessions = counsellingSessionRepository.findByMentorId(userId);
        var meetings = meetingRepository.findByMentorId(userId);

        int totalBookings = sessions.size();
        int upcoming = (int) sessions.stream().filter(s -> s.getStatus() == SessionStatus.CONFIRMED || s.getStatus() == SessionStatus.REQUESTED).count();
        int completed = (int) sessions.stream().filter(s -> s.getStatus() == SessionStatus.COMPLETED).count();
        int totalMeetings = (int) meetings.stream().filter(m -> m.getStatus() == MeetingStatus.APPROVED).count();

        BigDecimal rating = mentorProfileRepository.findByUserId(userId)
                .map(MentorProfile::getRatingAvg)
                .orElse(BigDecimal.valueOf(5.0));

        return MentorStatsDto.builder()
                .totalBookings(totalBookings)
                .upcomingSessions(upcoming)
                .completedSessions(completed)
                .totalMeetings(totalMeetings)
                .averageRating(rating)
                .build();
    }

    public MentorProfileResponse mapToResponse(MentorProfile p) {
        List<AvailabilitySlotDto> slots = new ArrayList<>();
        if (p.getAvailabilities() != null) {
            for (MentorAvailability av : p.getAvailabilities()) {
                slots.add(AvailabilitySlotDto.builder()
                        .weekday(av.getWeekday())
                        .startTime(av.getStartTime())
                        .endTime(av.getEndTime())
                        .build());
            }
        }

        return MentorProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .fullName(p.getUser().getFullName())
                .email(p.getUser().getEmail())
                .phone(p.getUser().getPhone())
                .titleRole(p.getTitleRole())
                .companyOrInstitution(p.getCompanyOrInstitution())
                .qualification(p.getQualification())
                .yearsOfExperience(p.getYearsOfExperience())
                .bio(p.getBio())
                .specialization(p.getSpecialization())
                .hourlyRate(p.getHourlyRate())
                .ratingAvg(p.getRatingAvg())
                .reviewCount(p.getReviewCount())
                .verificationStatus(p.getVerificationStatus())
                .linkedinUrl(p.getLinkedinUrl())
                .avatarUrl(p.getAvatarUrl())
                .languagesSpoken(new ArrayList<>(p.getLanguagesSpoken()))
                .expertiseTags(new ArrayList<>(p.getExpertiseTags()))
                .availabilities(slots)
                .build();
    }
}

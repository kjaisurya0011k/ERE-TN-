package com.edunova.repository;

import com.edunova.domain.MeetingRegistrationStatus;
import com.edunova.domain.entity.Meeting;
import com.edunova.domain.entity.MeetingRegistration;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MeetingRegistrationRepository extends JpaRepository<MeetingRegistration, UUID> {
    List<MeetingRegistration> findByUser(UserAccount user);
    List<MeetingRegistration> findByUserId(UUID userId);
    List<MeetingRegistration> findByMeeting(Meeting meeting);
    List<MeetingRegistration> findByMeetingId(UUID meetingId);
    Optional<MeetingRegistration> findByMeetingIdAndUserId(UUID meetingId, UUID userId);
    long countByMeetingIdAndStatus(UUID meetingId, MeetingRegistrationStatus status);
    boolean existsByMeetingIdAndUserIdAndStatus(UUID meetingId, UUID userId, MeetingRegistrationStatus status);
}

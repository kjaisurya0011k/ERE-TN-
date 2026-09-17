package com.edunova.repository;

import com.edunova.domain.MeetingStatus;
import com.edunova.domain.entity.Meeting;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, UUID> {
    List<Meeting> findByStatus(MeetingStatus status);
    List<Meeting> findByMentor(UserAccount mentor);
    List<Meeting> findByMentorId(UUID mentorId);
    Optional<Meeting> findByRoomCode(String roomCode);

    @Query("SELECT m FROM Meeting m WHERE m.status = 'APPROVED' AND (m.meetingDate IS NULL OR m.meetingDate >= :today) ORDER BY m.meetingDate ASC, m.startTime ASC")
    List<Meeting> findUpcomingApprovedMeetings(LocalDate today);

    List<Meeting> findByStatusOrderByCreatedAtDesc(MeetingStatus status);
}

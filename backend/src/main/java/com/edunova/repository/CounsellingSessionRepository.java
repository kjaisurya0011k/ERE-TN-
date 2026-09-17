package com.edunova.repository;

import com.edunova.domain.SessionStatus;
import com.edunova.domain.entity.CounsellingSession;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CounsellingSessionRepository extends JpaRepository<CounsellingSession, UUID> {
    List<CounsellingSession> findByStudent(UserAccount student);
    List<CounsellingSession> findByStudentId(UUID studentId);
    List<CounsellingSession> findByMentor(UserAccount mentor);
    List<CounsellingSession> findByMentorId(UUID mentorId);
    boolean existsByMentorIdAndSessionDateAndStartTimeAndStatusNot(UUID mentorId, LocalDate sessionDate, LocalTime startTime, SessionStatus status);
}

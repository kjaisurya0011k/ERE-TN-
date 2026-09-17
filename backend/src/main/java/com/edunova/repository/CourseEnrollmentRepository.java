package com.edunova.repository;

import com.edunova.domain.entity.Course;
import com.edunova.domain.entity.CourseEnrollment;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, UUID> {
    List<CourseEnrollment> findByUser(UserAccount user);
    List<CourseEnrollment> findByUserId(UUID userId);
    Optional<CourseEnrollment> findByCourseIdAndUserId(String courseId, UUID userId);
    boolean existsByCourseIdAndUserId(String courseId, UUID userId);
}

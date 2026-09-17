package com.edunova.repository;

import com.edunova.domain.entity.Lesson;
import com.edunova.domain.entity.LessonProgress;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    List<LessonProgress> findByUser(UserAccount user);
    List<LessonProgress> findByUserId(UUID userId);
    Optional<LessonProgress> findByLessonIdAndUserId(UUID lessonId, UUID userId);
    List<LessonProgress> findByLesson_Module_Course_IdAndUserId(String courseId, UUID userId);
}

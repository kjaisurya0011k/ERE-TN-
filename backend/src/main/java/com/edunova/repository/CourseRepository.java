package com.edunova.repository;

import com.edunova.domain.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByCategoryIgnoreCase(String category);
    List<Course> findByLevelIgnoreCase(String level);
}

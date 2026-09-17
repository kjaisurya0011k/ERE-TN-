package com.edunova.repository;

import com.edunova.domain.entity.FutureTalk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FutureTalkRepository extends JpaRepository<FutureTalk, String> {
    List<FutureTalk> findByStatusOrderByTalkDateAsc(String status);
    List<FutureTalk> findByTalkDateGreaterThanEqualOrderByTalkDateAsc(LocalDate date);
}

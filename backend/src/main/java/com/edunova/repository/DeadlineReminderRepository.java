package com.edunova.repository;

import com.edunova.domain.entity.DeadlineReminder;
import com.edunova.domain.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeadlineReminderRepository extends JpaRepository<DeadlineReminder, UUID> {
    List<DeadlineReminder> findByUser(UserAccount user);
    List<DeadlineReminder> findByUserId(UUID userId);
    Optional<DeadlineReminder> findByUserIdAndOpportunityId(UUID userId, String opportunityId);
}

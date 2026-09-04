package com.trustlend.repository;

import com.trustlend.entity.LoanRequest;
import com.trustlend.entity.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LoanRequestRepository extends JpaRepository<LoanRequest, Long> {

    List<LoanRequest> findByBorrowerIdOrderByCreatedAtDesc(Long borrowerId);

    List<LoanRequest> findByItemOwnerIdOrderByCreatedAtDesc(Long ownerId);

    boolean existsByItemIdAndBorrowerIdAndStatus(Long itemId, Long borrowerId, LoanStatus status);

    /** Used by the scheduled overdue-check job. */
    List<LoanRequest> findByStatusAndRequestedDueDateBefore(LoanStatus status, LocalDate date);
}

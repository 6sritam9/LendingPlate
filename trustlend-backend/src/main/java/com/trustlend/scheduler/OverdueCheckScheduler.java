package com.trustlend.scheduler;

import com.trustlend.entity.LoanRequest;
import com.trustlend.entity.enums.LoanStatus;
import com.trustlend.repository.LoanRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Background job: sweeps all BORROWED loans and flips any past their due date to OVERDUE.
 *
 * This is intentionally a separate step from the borrow/return flow rather than computing
 * "is it overdue?" on the fly in every response - a real system would want this as a durable
 * status (so it can drive reminder emails, sorting, reporting, etc.) rather than a derived
 * value. Cron schedule is externalized to application.properties (trustlend.overdue-check-cron)
 * so it can be tightened up for demos without a code change.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueCheckScheduler {

    private final LoanRequestRepository loanRequestRepository;

    @Scheduled(cron = "${trustlend.overdue-check-cron}")
    public void flagOverdueLoans() {
        List<LoanRequest> overdue = loanRequestRepository
                .findByStatusAndRequestedDueDateBefore(LoanStatus.BORROWED, LocalDate.now());

        if (overdue.isEmpty()) {
            log.info("Overdue check ran: no newly overdue loans found.");
            return;
        }

        overdue.forEach(loan -> loan.setStatus(LoanStatus.OVERDUE));
        loanRequestRepository.saveAll(overdue);

        log.info("Overdue check ran: flagged {} loan(s) as OVERDUE.", overdue.size());
        // In a fuller build, this is also where you'd trigger an email/push notification
        // to both the borrower and the owner.
    }
}

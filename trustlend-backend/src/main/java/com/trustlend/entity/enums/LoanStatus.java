package com.trustlend.entity.enums;

public enum LoanStatus {
    PENDING,    // borrower requested, awaiting owner decision
    REJECTED,   // owner declined the request
    BORROWED,   // owner approved; item is currently with the borrower
    RETURNED,   // borrower gave it back, cycle complete
    OVERDUE     // BORROWED past its due date - set automatically by the scheduled job
}

package com.trustlend.entity;

import com.trustlend.entity.enums.LoanStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private User borrower;

    /** Proposed by the borrower when requesting; becomes the binding due date once approved. */
    @Column(name = "requested_due_date", nullable = false)
    private LocalDate requestedDueDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LoanStatus status = LoanStatus.PENDING;

    @Column(name = "borrowed_at")
    private LocalDateTime borrowedAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

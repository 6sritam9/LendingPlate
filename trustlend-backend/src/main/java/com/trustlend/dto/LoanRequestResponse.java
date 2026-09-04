package com.trustlend.dto;

import com.trustlend.entity.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequestResponse {
    private Long id;
    private Long itemId;
    private String itemName;
    private Long ownerId;
    private String ownerName;
    private Long borrowerId;
    private String borrowerName;
    private LocalDate requestedDueDate;
    private LoanStatus status;
    private LocalDateTime borrowedAt;
    private LocalDateTime returnedAt;
    private LocalDateTime createdAt;
}

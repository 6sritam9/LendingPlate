package com.trustlend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateLoanRequest {
    @NotNull
    private Long itemId;

    @NotNull @Future(message = "Requested due date must be in the future")
    private LocalDate requestedDueDate;
}

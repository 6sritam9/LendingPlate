package com.trustlend.controller;

import com.trustlend.dto.CreateLoanRequest;
import com.trustlend.dto.LoanRequestResponse;
import com.trustlend.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<LoanRequestResponse> request(@Valid @RequestBody CreateLoanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loanService.requestLoan(request));
    }

    @GetMapping("/borrowed")
    public ResponseEntity<List<LoanRequestResponse>> borrowed() {
        return ResponseEntity.ok(loanService.getMyBorrowRequests());
    }

    @GetMapping("/lending")
    public ResponseEntity<List<LoanRequestResponse>> lending() {
        return ResponseEntity.ok(loanService.getRequestsForMyItems());
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<LoanRequestResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.approve(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<LoanRequestResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.reject(id));
    }

    @PatchMapping("/{id}/return")
    public ResponseEntity<LoanRequestResponse> markReturned(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.markReturned(id));
    }
}

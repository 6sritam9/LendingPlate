package com.trustlend.service;

import com.trustlend.dto.CreateLoanRequest;
import com.trustlend.dto.LoanRequestResponse;
import com.trustlend.entity.Item;
import com.trustlend.entity.LoanRequest;
import com.trustlend.entity.User;
import com.trustlend.entity.enums.LoanStatus;
import com.trustlend.exception.BadRequestException;
import com.trustlend.exception.ConflictException;
import com.trustlend.exception.ForbiddenException;
import com.trustlend.exception.ResourceNotFoundException;
import com.trustlend.repository.ItemRepository;
import com.trustlend.repository.LoanRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Owns the borrowing lifecycle:
 *   PENDING --(owner approves)--> BORROWED --(either side marks returned)--> RETURNED
 *   PENDING --(owner rejects)--> REJECTED
 *   BORROWED --(scheduled job, past due date)--> OVERDUE --(returned)--> RETURNED
 *
 * Item availability is flipped in lockstep with status changes so browsing always reflects reality.
 */
@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRequestRepository loanRequestRepository;
    private final ItemRepository itemRepository;
    private final CurrentUserService currentUserService;

    public LoanRequestResponse requestLoan(CreateLoanRequest request) {
        User me = currentUserService.get();

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getOwner().getId().equals(me.getId())) {
            throw new BadRequestException("You cannot borrow your own item");
        }

        if (!item.isAvailable()) {
            throw new BadRequestException("This item is not currently available");
        }

        boolean alreadyPending = loanRequestRepository
                .existsByItemIdAndBorrowerIdAndStatus(item.getId(), me.getId(), LoanStatus.PENDING);
        if (alreadyPending) {
            throw new ConflictException("You already have a pending request for this item");
        }

        LoanRequest loanRequest = LoanRequest.builder()
                .item(item)
                .borrower(me)
                .requestedDueDate(request.getRequestedDueDate())
                .status(LoanStatus.PENDING)
                .build();

        return toDto(loanRequestRepository.save(loanRequest));
    }

    public List<LoanRequestResponse> getMyBorrowRequests() {
        User me = currentUserService.get();
        return loanRequestRepository.findByBorrowerIdOrderByCreatedAtDesc(me.getId())
                .stream().map(this::toDto).toList();
    }

    public List<LoanRequestResponse> getRequestsForMyItems() {
        User me = currentUserService.get();
        return loanRequestRepository.findByItemOwnerIdOrderByCreatedAtDesc(me.getId())
                .stream().map(this::toDto).toList();
    }

    public LoanRequestResponse approve(Long loanRequestId) {
        LoanRequest loan = getOwnedByItemOwner(loanRequestId);
        requireStatus(loan, LoanStatus.PENDING, "approve");

        Item item = loan.getItem();
        if (!item.isAvailable()) {
            throw new ConflictException("This item was already lent out to someone else");
        }

        loan.setStatus(LoanStatus.BORROWED);
        loan.setBorrowedAt(LocalDateTime.now());
        item.setAvailable(false);

        itemRepository.save(item);
        return toDto(loanRequestRepository.save(loan));
    }

    public LoanRequestResponse reject(Long loanRequestId) {
        LoanRequest loan = getOwnedByItemOwner(loanRequestId);
        requireStatus(loan, LoanStatus.PENDING, "reject");
        loan.setStatus(LoanStatus.REJECTED);
        return toDto(loanRequestRepository.save(loan));
    }

    public LoanRequestResponse markReturned(Long loanRequestId) {
        User me = currentUserService.get();
        LoanRequest loan = loanRequestRepository.findById(loanRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan request not found"));

        boolean isBorrower = loan.getBorrower().getId().equals(me.getId());
        boolean isOwner = loan.getItem().getOwner().getId().equals(me.getId());
        if (!isBorrower && !isOwner) {
            throw new ForbiddenException("You are not part of this loan");
        }

        if (loan.getStatus() != LoanStatus.BORROWED && loan.getStatus() != LoanStatus.OVERDUE) {
            throw new BadRequestException("Only a borrowed or overdue item can be marked returned");
        }

        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnedAt(LocalDateTime.now());

        Item item = loan.getItem();
        item.setAvailable(true);
        itemRepository.save(item);

        return toDto(loanRequestRepository.save(loan));
    }

    private LoanRequest getOwnedByItemOwner(Long loanRequestId) {
        User me = currentUserService.get();
        LoanRequest loan = loanRequestRepository.findById(loanRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan request not found"));

        if (!loan.getItem().getOwner().getId().equals(me.getId())) {
            throw new ForbiddenException("Only the item's owner can perform this action");
        }
        return loan;
    }

    private void requireStatus(LoanRequest loan, LoanStatus expected, String action) {
        if (loan.getStatus() != expected) {
            throw new BadRequestException(
                    "Cannot " + action + " a loan request that is currently " + loan.getStatus()
            );
        }
    }

    private LoanRequestResponse toDto(LoanRequest l) {
        return LoanRequestResponse.builder()
                .id(l.getId())
                .itemId(l.getItem().getId())
                .itemName(l.getItem().getName())
                .ownerId(l.getItem().getOwner().getId())
                .ownerName(l.getItem().getOwner().getName())
                .borrowerId(l.getBorrower().getId())
                .borrowerName(l.getBorrower().getName())
                .requestedDueDate(l.getRequestedDueDate())
                .status(l.getStatus())
                .borrowedAt(l.getBorrowedAt())
                .returnedAt(l.getReturnedAt())
                .createdAt(l.getCreatedAt())
                .build();
    }
}

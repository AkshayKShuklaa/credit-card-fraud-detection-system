package com.fraud.backend.controller;

import com.fraud.backend.dto.DashboardStatsResponse;
import com.fraud.backend.dto.TransactionRequest;
import com.fraud.backend.entity.Transaction;
import com.fraud.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@Valid @RequestBody TransactionRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Transaction transaction = transactionService.processTransaction(request, username);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping
    public ResponseEntity<Page<Transaction>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
        return ResponseEntity.ok(transactionService.getAllTransactions(pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(transactionService.getDashboardStats());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions() {
        return ResponseEntity.ok(transactionService.getRecentTransactions());
    }
}

package com.fraud.backend.repository;

import com.fraud.backend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    Page<Transaction> findByUserId(String userId, Pageable pageable);
    Page<Transaction> findByIsFraud(Boolean isFraud, Pageable pageable);
    
    // For dashboard stats
    long count();
    long countByIsFraud(Boolean isFraud);
    List<Transaction> findTop10ByOrderByTransactionDateDesc();
}

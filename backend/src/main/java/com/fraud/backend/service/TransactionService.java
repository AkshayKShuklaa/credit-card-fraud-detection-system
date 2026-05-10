package com.fraud.backend.service;

import com.fraud.backend.dto.DashboardStatsResponse;
import com.fraud.backend.dto.FraudPredictionResponse;
import com.fraud.backend.dto.TransactionRequest;
import com.fraud.backend.entity.Transaction;
import com.fraud.backend.entity.User;
import com.fraud.backend.repository.TransactionRepository;
import com.fraud.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.mlServiceUrl}")
    private String mlServiceUrl;

    public Transaction processTransaction(TransactionRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Call ML Service
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> mlRequest = new HashMap<>();
        mlRequest.put("amount", request.getAmount());
        mlRequest.put("merchant", request.getMerchant());
        mlRequest.put("location", request.getLocation());

        FraudPredictionResponse prediction = new FraudPredictionResponse();
        try {
            ResponseEntity<FraudPredictionResponse> response = restTemplate.postForEntity(
                    mlServiceUrl, mlRequest, FraudPredictionResponse.class);
            prediction = response.getBody();
        } catch (Exception e) {
            // Fallback or error handling if ML service is down
            prediction.setIsFraud(false);
            prediction.setFraudScore(java.math.BigDecimal.ZERO);
        }

        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setAmount(request.getAmount());
        transaction.setCardNumber(request.getCardNumber());
        transaction.setMerchant(request.getMerchant());
        transaction.setLocation(request.getLocation());
        transaction.setIsFraud(prediction.getIsFraud());
        transaction.setFraudScore(prediction.getFraudScore());

        return transactionRepository.save(transaction);
    }

    public Page<Transaction> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable);
    }

    public DashboardStatsResponse getDashboardStats() {
        long total = transactionRepository.count();
        long fraud = transactionRepository.countByIsFraud(true);
        double percentage = total > 0 ? ((double) fraud / total) * 100 : 0;

        return DashboardStatsResponse.builder()
                .totalTransactions(total)
                .fraudulentTransactions(fraud)
                .fraudPercentage(percentage)
                .build();
    }
    
    public List<Transaction> getRecentTransactions() {
        return transactionRepository.findTop10ByOrderByTransactionDateDesc();
    }
}

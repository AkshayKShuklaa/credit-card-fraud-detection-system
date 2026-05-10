package com.fraud.backend.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions")
@Data
@NoArgsConstructor
public class Transaction {
    @Id
    private String id;

    private String userId;

    private String cardNumber;

    private BigDecimal amount;

    private String merchant;

    @CreatedDate
    private LocalDateTime transactionDate;

    private String location;

    private Boolean isFraud = false;

    private BigDecimal fraudScore;
}

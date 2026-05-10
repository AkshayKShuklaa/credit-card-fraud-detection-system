package com.fraud.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FraudPredictionResponse {
    private Boolean isFraud;
    private BigDecimal fraudScore;
}

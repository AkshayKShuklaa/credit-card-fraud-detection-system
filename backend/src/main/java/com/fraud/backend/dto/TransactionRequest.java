package com.fraud.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {
    @NotBlank
    private String cardNumber;

    @NotNull
    private BigDecimal amount;

    @NotBlank
    private String merchant;

    private String location;
}

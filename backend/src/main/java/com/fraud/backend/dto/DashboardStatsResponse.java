package com.fraud.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalTransactions;
    private long fraudulentTransactions;
    private double fraudPercentage;
}

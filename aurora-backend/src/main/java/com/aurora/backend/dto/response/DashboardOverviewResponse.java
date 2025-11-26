package com.aurora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardOverviewResponse {
    @Builder.Default
    BigDecimal totalRevenue = BigDecimal.ZERO;
    long totalBookings;
    double occupancyRate;
    @Builder.Default
    BigDecimal averageBookingValue = BigDecimal.ZERO;
    long newCustomers;
    long returningCustomers;
    double revenueGrowthPercent;
}


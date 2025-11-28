package com.aurora.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueStatistics {
    String periodLabel;
    @Builder.Default
    BigDecimal revenue = BigDecimal.ZERO;
    long bookingCount;
    @Builder.Default
    BigDecimal averageBookingValue = BigDecimal.ZERO;
}


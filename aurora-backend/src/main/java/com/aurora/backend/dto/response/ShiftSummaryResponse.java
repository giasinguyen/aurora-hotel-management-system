package com.aurora.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

/**
 * DTO for shift summary statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftSummaryResponse {
    long totalShifts;
    long totalCheckIns;
    long totalCheckOuts;
    
    @Builder.Default
    BigDecimal totalRevenue = BigDecimal.ZERO;
    
    @Builder.Default
    BigDecimal averageShiftRevenue = BigDecimal.ZERO;
}

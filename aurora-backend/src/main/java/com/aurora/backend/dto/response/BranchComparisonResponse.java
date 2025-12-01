package com.aurora.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

/**
 * DTO for branch comparison statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BranchComparisonResponse {
    String branchId;
    String branchCode;
    String branchName;
    String city;
    
    @Builder.Default
    BigDecimal totalRevenue = BigDecimal.ZERO;
    
    long totalBookings;
    double occupancyRate;
    double averageRating;
    long roomCount;
    long staffCount;
    double customerSatisfaction;
}

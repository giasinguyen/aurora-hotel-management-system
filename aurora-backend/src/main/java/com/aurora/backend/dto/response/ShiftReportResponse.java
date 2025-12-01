package com.aurora.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for shift report data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftReportResponse {
    String shiftId;
    String staffId;
    String staffName;
    LocalDate shiftDate;
    String shiftType; // MORNING, AFTERNOON, NIGHT
    String startTime;
    String endTime;
    long checkIns;
    long checkOuts;
    long bookingsCreated;
    
    @Builder.Default
    BigDecimal revenue = BigDecimal.ZERO;
}

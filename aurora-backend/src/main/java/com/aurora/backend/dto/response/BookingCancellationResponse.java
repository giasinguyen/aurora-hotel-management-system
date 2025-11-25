package com.aurora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCancellationResponse {
    
    private String bookingId;
    
    private String bookingCode;
    
    private LocalDateTime cancelledAt;
    
    private String cancellationReason;
    
    private BigDecimal refundAmount;
    
    private Integer refundPercentage; // 0, 50, or 100
    
    private String refundPolicy; 
    
    private String message;
}

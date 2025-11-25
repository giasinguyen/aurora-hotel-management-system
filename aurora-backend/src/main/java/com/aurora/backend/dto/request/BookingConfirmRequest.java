package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingConfirmRequest {
    
    @NotBlank(message = "Booking ID is required")
    private String bookingId;
    
    private String confirmedBy; 
    
    private String notes; 
}

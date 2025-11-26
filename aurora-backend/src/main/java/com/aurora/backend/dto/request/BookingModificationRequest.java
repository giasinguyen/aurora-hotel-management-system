package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingModificationRequest {
    
    @NotBlank(message = "Booking ID is required")
    private String bookingId;
    
    private LocalDate newCheckin;
    
    private LocalDate newCheckout;
    
    private String newRoomTypeId; 
    
    private Integer newAdults;
    
    private Integer newChildren;
    
    private String modificationReason;
}

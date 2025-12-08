package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceBookingCreationRequest {
    @NotBlank(message = "BOOKING_ID_REQUIRED")
    String bookingId;
    
    @NotBlank(message = "SERVICE_ID_REQUIRED")
    String serviceId;
    
    // Customer ID is optional - will use booking's customer if not provided
    String customerId;
    
    @NotBlank(message = "ROOM_ID_REQUIRED")
    String roomId; // Room that this service is for - REQUIRED for booking services
    
    @NotNull(message = "DATETIME_REQUIRED")
    LocalDateTime dateTime;
    
    @Positive(message = "QUANTITY_POSITIVE")
    Integer quantity;
    
    @Positive(message = "PRICE_POSITIVE")
    Double price;
    
    String status;
}

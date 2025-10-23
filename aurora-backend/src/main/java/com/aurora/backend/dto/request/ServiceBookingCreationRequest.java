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
    
    @NotBlank(message = "CUSTOMER_ID_REQUIRED")
    String customerId;
    
    @NotNull(message = "DATETIME_REQUIRED")
    LocalDateTime dateTime;
    
    @Positive(message = "QUANTITY_POSITIVE")
    Integer quantity;
    
    @Positive(message = "PRICE_POSITIVE")
    Double price;
    
    String status;
}

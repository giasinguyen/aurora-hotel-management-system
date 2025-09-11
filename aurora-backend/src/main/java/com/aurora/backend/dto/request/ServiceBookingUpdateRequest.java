package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceBookingUpdateRequest {
    LocalDateTime dateTime;
    
    @Positive(message = "QUANTITY_POSITIVE")
    Integer quantity;
    
    @Positive(message = "PRICE_POSITIVE")
    Double price;
    
    String status;
}

package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCreationRequest {
    @NotBlank(message = "HOTEL_ID_REQUIRED")
    String hotelId;
    
    @NotBlank(message = "SERVICE_NAME_REQUIRED")
    String name;
    
    String type;
    
    String description;
    
    @Positive(message = "BASE_PRICE_POSITIVE")
    Double basePrice;
}

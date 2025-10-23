package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceUpdateRequest {
    String name;
    
    String type;
    
    String description;
    
    @Positive(message = "BASE_PRICE_POSITIVE")
    Double basePrice;
}

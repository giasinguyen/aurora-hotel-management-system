package com.aurora.backend.dto.request;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionUpdateRequest {
    String name;
    String description;
    
    @PositiveOrZero(message = "DISCOUNT_POSITIVE")
    Double discount;
    
    LocalDate startDate;
    LocalDate endDate;
    Boolean active;
}

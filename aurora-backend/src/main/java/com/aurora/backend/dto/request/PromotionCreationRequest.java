package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionCreationRequest {
    @NotBlank(message = "PROMOTION_CODE_REQUIRED")
    String code;
    
    @NotBlank(message = "PROMOTION_NAME_REQUIRED")
    String name;
    
    String description;
    
    @NotNull(message = "DISCOUNT_REQUIRED")
    @PositiveOrZero(message = "DISCOUNT_POSITIVE")
    Double discount;
    
    @NotNull(message = "START_DATE_REQUIRED")
    LocalDate startDate;
    
    @NotNull(message = "END_DATE_REQUIRED")
    LocalDate endDate;
    
    Boolean active;
}

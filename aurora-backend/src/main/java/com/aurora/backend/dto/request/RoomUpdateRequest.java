package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomUpdateRequest {
    String roomNumber;
    
    String roomTypeId;
    
    @Positive(message = "FLOOR_POSITIVE")
    Integer floor;
    
    String status;
    
    String viewType; // CITY, SEA, MOUNTAIN, GARDEN
    
    // Price management
    @DecimalMin(value = "0.01", message = "BASE_PRICE_POSITIVE")
    BigDecimal basePrice;
    
    @DecimalMin(value = "0.0", message = "SALE_PERCENT_NON_NEGATIVE")
    @DecimalMax(value = "100.0", message = "SALE_PERCENT_MAX_100")
    BigDecimal salePercent;
    
    List<String> images;
}

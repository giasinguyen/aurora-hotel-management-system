package com.aurora.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomTypeUpdateRequest {
    String name;
    
    @Pattern(regexp = "^[A-Z]{3,5}$", message = "CODE_PATTERN_INVALID")
    String code;
    
    // Price information - Only reference minimum price
    @DecimalMin(value = "0.01", message = "PRICE_FROM_POSITIVE")
    BigDecimal priceFrom;
    
    // Capacity information
    @Positive(message = "CAPACITY_ADULTS_POSITIVE")
    Integer capacityAdults;
    
    @PositiveOrZero(message = "CAPACITY_CHILDREN_POSITIVE_OR_ZERO")
    Integer capacityChildren;
    
    @Positive(message = "MAX_OCCUPANCY_POSITIVE")
    Integer maxOccupancy;
    
    @PositiveOrZero(message = "SIZE_POSITIVE_OR_ZERO")
    Double sizeM2;
    
    Boolean refundable;
    Set<String> amenityIds;
    List<String> images;
}

package com.aurora.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomTypeCreationRequest {
    @NotBlank(message = "BRANCH_ID_REQUIRED")
    String branchId;
    
    String categoryId; // Room category: Standard, Deluxe, Presidential Suite
    
    @NotBlank(message = "ROOM_TYPE_NAME_REQUIRED")
    String name;
    
    @NotBlank(message = "ROOM_TYPE_CODE_REQUIRED")
    @Pattern(regexp = "^[A-Z]{3,5}$", message = "CODE_PATTERN_INVALID")
    String code;
    
    // Price information - Only reference minimum price
    @NotNull(message = "PRICE_FROM_REQUIRED")
    @DecimalMin(value = "0.01", message = "PRICE_FROM_POSITIVE")
    BigDecimal priceFrom; // Giá tham khảo từ
    
    // Capacity information
    @NotNull(message = "CAPACITY_ADULTS_REQUIRED")
    @Positive(message = "CAPACITY_ADULTS_POSITIVE")
    Integer capacityAdults;
    
    @PositiveOrZero(message = "CAPACITY_CHILDREN_POSITIVE_OR_ZERO")
    Integer capacityChildren;
    
    @NotNull(message = "MAX_OCCUPANCY_REQUIRED")
    @Positive(message = "MAX_OCCUPANCY_POSITIVE")
    Integer maxOccupancy;
    
    @PositiveOrZero(message = "SIZE_POSITIVE_OR_ZERO")
    Double sizeM2;
    
    Boolean refundable;
    Set<String> amenityIds;
    String imageUrl; // Ảnh đại diện cho room type
}

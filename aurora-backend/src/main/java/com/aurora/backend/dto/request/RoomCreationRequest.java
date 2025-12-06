package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomCreationRequest {
    @NotBlank(message = "BRANCH_ID_REQUIRED")
    String branchId;
    
    @NotBlank(message = "ROOM_TYPE_ID_REQUIRED")
    String roomTypeId;
    
    @NotBlank(message = "ROOM_NUMBER_REQUIRED")
    String roomNumber;
    
    @Positive(message = "FLOOR_POSITIVE")
    Integer floor;
    
    String status;
    
    String viewType; // CITY, SEA, MOUNTAIN, GARDEN
    
    // Price management
    @NotNull(message = "BASE_PRICE_REQUIRED")
    @DecimalMin(value = "0.01", message = "BASE_PRICE_POSITIVE")
    BigDecimal basePrice; // Giá gốc của phòng
    
    @DecimalMin(value = "0.0", message = "SALE_PERCENT_NON_NEGATIVE")
    @DecimalMax(value = "100.0", message = "SALE_PERCENT_MAX_100")
    BigDecimal salePercent; // % giảm giá (0-100)
    
    List<String> images;
}

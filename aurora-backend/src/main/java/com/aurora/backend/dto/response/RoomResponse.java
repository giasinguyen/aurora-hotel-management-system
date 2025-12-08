package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {
    String id;
    String branchId;
    String branchName;
    String roomTypeId;
    String roomTypeName;
    String categoryId;
    String categoryName;
    String roomNumber;
    Integer floor;
    String status;
    Integer capacityAdults;
    Integer capacityChildren;
    Double sizeM2;
    String viewType;
    
    // Price management
    BigDecimal basePrice; // Giá gốc
    BigDecimal salePercent; // % giảm giá
    BigDecimal priceFinal; // Giá cuối cùng sau giảm giá (stored in DB)
    
    List<String> images;
}

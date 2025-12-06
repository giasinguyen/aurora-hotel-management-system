package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomTypeResponse {
    String id;
    String branchId;
    String branchName;
    String categoryId;
    String name;
    String code;
    
    // Price information - Only reference minimum price
    BigDecimal priceFrom; // Giá tham khảo từ
    
    // Capacity information
    Integer capacityAdults;
    Integer capacityChildren;
    Integer maxOccupancy;
    
    Double sizeM2;
    Boolean refundable;
    Integer totalRooms;
    Integer availableRooms;
    Set<AmenityResponse> amenities;
    List<String> images;
}

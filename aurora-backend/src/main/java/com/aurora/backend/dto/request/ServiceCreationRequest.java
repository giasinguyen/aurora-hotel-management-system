package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCreationRequest {
    @NotBlank(message = "BRANCH_ID_REQUIRED")
    String branchId;
    
    @NotBlank(message = "SERVICE_NAME_REQUIRED")
    String name;
    
    @NotBlank(message = "SERVICE_CATEGORY_REQUIRED")
    String categoryId;
    
    String description;
    
    @Positive(message = "BASE_PRICE_POSITIVE")
    Double basePrice;
    
    String unit; // "per hour", "per person", "per item", "per trip"
    
    Integer durationMinutes; // Duration (in minutes)
    
    Integer maxCapacityPerSlot; // Số lượng khách tối đa mỗi slot thời gian
    
    Boolean requiresBooking; // Có cần đặt trước không
    
    Boolean active; // Dịch vụ có đang hoạt động không
    
    String operatingHours; // "08:00-22:00" or "24/7"
    
    List<String> images;
}

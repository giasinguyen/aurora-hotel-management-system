package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResponse {
    String id;
    String branchId;
    String branchName;
    String name;
    String categoryId;
    String categoryName;
    String description;
    java.math.BigDecimal basePrice;
    String unit;
    Integer durationMinutes;
    Integer maxCapacityPerSlot;
    Boolean requiresBooking;
    Boolean active;
    String operatingHours;
    List<String> images;
}

package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomTypeUpdateRequest {
    String name;
    String code;
    
    @Positive(message = "CAPACITY_ADULTS_POSITIVE")
    Integer capacityAdults;
    
    @Positive(message = "CAPACITY_CHILDREN_POSITIVE")
    Integer capacityChildren;
    
    @Positive(message = "SIZE_POSITIVE")
    Double sizeM2;
    
    Boolean refundable;
    Set<String> amenityIds;
}

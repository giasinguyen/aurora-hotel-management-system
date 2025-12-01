package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    
    List<String> images;
}

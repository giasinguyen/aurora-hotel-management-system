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
    
    List<String> images;
}

package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FacilityCreationRequest {
    @NotBlank(message = "HOTEL_ID_REQUIRED")
    String hotelId;
    
    @NotBlank(message = "FACILITY_NAME_REQUIRED")
    String name;
    
    String openingHours;
    String policies;
}

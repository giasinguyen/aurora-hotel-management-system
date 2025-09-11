package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AmenityCreationRequest {
    @NotBlank(message = "AMENITY_NAME_REQUIRED")
    String name;
    
    @NotBlank(message = "AMENITY_TYPE_REQUIRED")
    String type;
    
    String description;
}

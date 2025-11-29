package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FacilityCreationRequest {
    @NotBlank(message = "BRANCH_ID_REQUIRED")
    String branchId;
    
    @NotBlank(message = "FACILITY_NAME_REQUIRED")
    String name;
    
    String openingHours;
    String policies;
    List<String> images;
}

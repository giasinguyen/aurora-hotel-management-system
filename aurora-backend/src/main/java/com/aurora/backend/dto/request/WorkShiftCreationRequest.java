package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkShiftCreationRequest {
    
    @NotBlank(message = "Shift name is required")
    String name;
    
    String description;
    
    @NotNull(message = "Start time is required")
    LocalTime startTime;
    
    @NotNull(message = "End time is required")
    LocalTime endTime;
    
    String colorCode; // Optional color for calendar UI
    
    String branchId; // Null for global shifts, specific branch ID for branch-specific shifts
    
    @Builder.Default
    Boolean active = true;
}

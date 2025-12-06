package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffShiftAssignmentRequest {
    
    @NotBlank(message = "Staff ID is required")
    String staffId;
    
    @NotBlank(message = "Work shift ID is required")
    String workShiftId;
    
    @NotNull(message = "Shift date is required")
    LocalDate shiftDate;
    
    String branchId;
    String assignedById; // ID of manager who assigned
    String notes;
}

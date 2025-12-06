package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BulkShiftAssignmentRequest {
    
    @NotEmpty(message = "Staff IDs are required")
    List<String> staffIds;
    
    @NotNull(message = "Work shift ID is required")
    String workShiftId;
    
    @NotNull(message = "Start date is required")
    LocalDate startDate;
    
    @NotNull(message = "End date is required")
    LocalDate endDate;
    
    String branchId;
    String assignedById; // ID of manager who assigned
    String notes;
    
    // Optional: Days of week to assign (1=Monday, 7=Sunday)
    List<Integer> daysOfWeek; // If null, assign every day
}

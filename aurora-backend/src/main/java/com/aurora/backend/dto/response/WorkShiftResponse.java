package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkShiftResponse {
    
    String id;
    String name;
    String description;
    LocalTime startTime;
    LocalTime endTime;
    String colorCode;
    Boolean active;
    String branchId;
    String branchName;
    Double durationInHours;
    
    // Audit fields
    String createdAt;
    String updatedAt;
    String createdBy;
    String updatedBy;
}

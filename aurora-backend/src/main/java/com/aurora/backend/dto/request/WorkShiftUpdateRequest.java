package com.aurora.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkShiftUpdateRequest {
    
    String name;
    String description;
    LocalTime startTime;
    LocalTime endTime;
    String colorCode;
    String branchId;
    Boolean active;
}

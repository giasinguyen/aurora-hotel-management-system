package com.aurora.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftCheckOutRequest {
    
    String assignmentId; // Optional, will auto-detect from current shift
    String notes; // Staff can add notes on check-out
}

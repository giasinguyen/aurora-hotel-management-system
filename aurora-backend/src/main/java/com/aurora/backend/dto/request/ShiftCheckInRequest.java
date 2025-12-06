package com.aurora.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftCheckInRequest {
    
    String assignmentId; // Optional, will auto-detect from current shift
    String location; // Check-in location (optional)
    String notes; // Staff can add notes on check-in
    String deviceInfo; // Auto-captured from request
    String ipAddress; // Auto-captured from request
}

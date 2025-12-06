package com.aurora.backend.dto.response;

import com.aurora.backend.enums.CheckInStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftCheckInResponse {
    
    String id;
    String assignmentId;
    String staffId;
    String staffName;
    String checkInTime;
    String checkOutTime;
    CheckInStatus status;
    String ipAddress;
    String deviceInfo;
    String notes;
    Boolean isLate;
    Boolean isEarlyDeparture;
    Integer lateMinutes;
    Integer earlyDepartureMinutes;
    Double workingHours;
    
    // Shift info
    String shiftName;
    String shiftDate;
    String shiftStartTime;
    String shiftEndTime;
    
    String createdAt;
}

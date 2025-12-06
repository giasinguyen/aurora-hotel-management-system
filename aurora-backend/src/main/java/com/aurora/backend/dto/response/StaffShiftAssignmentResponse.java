package com.aurora.backend.dto.response;

import com.aurora.backend.enums.ShiftAssignmentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffShiftAssignmentResponse {
    
    String id;
    String staffId;
    String staffName;
    String staffUsername;
    String workShiftId;
    String workShiftName;
    LocalDate shiftDate;
    String branchId;
    String branchName;
    ShiftAssignmentStatus status;
    String notes;
    String assignedBy;
    String assignedByName;
    String cancelledReason;
    
    // Shift details
    String startTime;
    String endTime;
    String shiftColorCode;
    
    // Check-in info
    Boolean hasCheckedIn;
    String checkInTime;
    String checkOutTime;
    
    // Audit fields
    String createdAt;
    String updatedAt;
}

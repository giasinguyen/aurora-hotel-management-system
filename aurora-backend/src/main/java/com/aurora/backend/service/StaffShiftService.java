package com.aurora.backend.service;

import com.aurora.backend.dto.request.BulkShiftAssignmentRequest;
import com.aurora.backend.dto.request.StaffShiftAssignmentRequest;
import com.aurora.backend.dto.response.StaffShiftAssignmentResponse;
import com.aurora.backend.enums.ShiftAssignmentStatus;

import java.time.LocalDate;
import java.util.List;

public interface StaffShiftService {
    StaffShiftAssignmentResponse assignShift(StaffShiftAssignmentRequest request);

    List<StaffShiftAssignmentResponse> bulkAssignShifts(BulkShiftAssignmentRequest request);

    StaffShiftAssignmentResponse updateAssignment(String id, StaffShiftAssignmentRequest request);

    void cancelAssignment(String id, String reason);

    StaffShiftAssignmentResponse getAssignment(String id);

    List<StaffShiftAssignmentResponse> getStaffShiftsForDate(String staffId, LocalDate date);

    List<StaffShiftAssignmentResponse> getStaffShiftsInRange(String staffId, LocalDate startDate, LocalDate endDate);

    List<StaffShiftAssignmentResponse> getShiftsForDate(LocalDate date, String branchId);

    List<StaffShiftAssignmentResponse> getShiftsInRange(LocalDate startDate, LocalDate endDate, String branchId);

    boolean hasActiveShiftNow(String staffId);

    StaffShiftAssignmentResponse getCurrentActiveShift(String staffId);

    StaffShiftAssignmentResponse updateAssignmentStatus(String id, ShiftAssignmentStatus status);
}

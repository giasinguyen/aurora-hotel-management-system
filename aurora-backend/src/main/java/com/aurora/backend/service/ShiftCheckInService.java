package com.aurora.backend.service;

import com.aurora.backend.dto.request.ShiftCheckInRequest;
import com.aurora.backend.dto.request.ShiftCheckOutRequest;
import com.aurora.backend.dto.response.ShiftCheckInResponse;

import java.time.LocalDate;
import java.util.List;

public interface ShiftCheckInService {
    ShiftCheckInResponse checkIn(ShiftCheckInRequest request);

    ShiftCheckInResponse checkOut(ShiftCheckOutRequest request);

    ShiftCheckInResponse getCheckInRecord(String id);

    List<ShiftCheckInResponse> getCheckInsByAssignment(String assignmentId);

    List<ShiftCheckInResponse> getStaffCheckIns(String staffId, LocalDate startDate, LocalDate endDate);

    List<ShiftCheckInResponse> getBranchCheckIns(String branchId, LocalDate startDate, LocalDate endDate);

    boolean isStaffCheckedIn(String staffId);

    ShiftCheckInResponse getCurrentCheckIn(String staffId);

    Double getTotalWorkingHours(String staffId, LocalDate startDate, LocalDate endDate);

    List<ShiftCheckInResponse> getLateCheckIns(LocalDate startDate, LocalDate endDate, String branchId);
}

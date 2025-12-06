package com.aurora.backend.service;

import com.aurora.backend.dto.request.WorkShiftCreationRequest;
import com.aurora.backend.dto.request.WorkShiftUpdateRequest;
import com.aurora.backend.dto.response.WorkShiftResponse;

import java.util.List;

public interface WorkShiftService {

    WorkShiftResponse createWorkShift(WorkShiftCreationRequest request);

    WorkShiftResponse updateWorkShift(String id, WorkShiftUpdateRequest request);

    WorkShiftResponse getWorkShift(String id);

    List<WorkShiftResponse> getAllActiveShifts();

    List<WorkShiftResponse> getShiftsByBranch(String branchId);

    void deleteWorkShift(String id);

    WorkShiftResponse toggleShiftStatus(String id, boolean active);
}

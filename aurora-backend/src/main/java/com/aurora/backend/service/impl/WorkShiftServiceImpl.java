package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.WorkShiftCreationRequest;
import com.aurora.backend.dto.request.WorkShiftUpdateRequest;
import com.aurora.backend.dto.response.WorkShiftResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.WorkShift;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.WorkShiftMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.WorkShiftRepository;
import com.aurora.backend.service.WorkShiftService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WorkShiftServiceImpl implements WorkShiftService {
    
    private final WorkShiftRepository workShiftRepository;
    private final BranchRepository branchRepository;
    private final WorkShiftMapper workShiftMapper;
    
    @Override
    public WorkShiftResponse createWorkShift(WorkShiftCreationRequest request) {
        log.info("Creating work shift: {}", request.getName());
        
        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime()) || 
            request.getStartTime().equals(request.getEndTime())) {
            throw new AppException(ErrorCode.SHIFT_INVALID_TIME_RANGE);
        }
        
        // Check for name uniqueness in the same branch
        if (request.getBranchId() != null) {
            boolean exists = workShiftRepository.existsByNameAndBranchId(
                request.getName(), request.getBranchId());
            if (exists) {
                throw new AppException(ErrorCode.SHIFT_NAME_EXISTED);
            }
        } else {
            boolean exists = workShiftRepository.existsByNameAndBranchIsNull(request.getName());
            if (exists) {
                throw new AppException(ErrorCode.SHIFT_NAME_EXISTED);
            }
        }
        
        // Check for overlapping shifts
        validateNoOverlappingShifts(request.getStartTime(), request.getEndTime(), 
            request.getBranchId(), null);
        
        // Build entity
        WorkShift workShift = WorkShift.builder()
            .name(request.getName())
            .description(request.getDescription())
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .colorCode(request.getColorCode())
            .active(true)
            .build();
        
        // Set branch if provided
        if (request.getBranchId() != null) {
            Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
            workShift.setBranch(branch);
        }
        
        WorkShift saved = workShiftRepository.save(workShift);
        log.info("Work shift created successfully with ID: {}", saved.getId());
        
        return workShiftMapper.toResponse(saved);
    }
    
    @Override
    public WorkShiftResponse updateWorkShift(String id, WorkShiftUpdateRequest request) {
        log.info("Updating work shift: {}", id);
        
        WorkShift workShift = workShiftRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
        
        // Update name if provided
        if (request.getName() != null && !request.getName().equals(workShift.getName())) {
            // Check uniqueness
            String branchId = workShift.getBranch() != null ? workShift.getBranch().getId() : null;
            if (branchId != null) {
                boolean exists = workShiftRepository.existsByNameAndBranchId(request.getName(), branchId);
                if (exists) {
                    throw new AppException(ErrorCode.SHIFT_NAME_EXISTED);
                }
            } else {
                boolean exists = workShiftRepository.existsByNameAndBranchIsNull(request.getName());
                if (exists) {
                    throw new AppException(ErrorCode.SHIFT_NAME_EXISTED);
                }
            }
            workShift.setName(request.getName());
        }
        
        // Update description
        if (request.getDescription() != null) {
            workShift.setDescription(request.getDescription());
        }
        
        // Update times if provided
        LocalTime newStartTime = request.getStartTime() != null ? request.getStartTime() : workShift.getStartTime();
        LocalTime newEndTime = request.getEndTime() != null ? request.getEndTime() : workShift.getEndTime();
        
        if (request.getStartTime() != null || request.getEndTime() != null) {
            // Validate time range
            if (newStartTime.isAfter(newEndTime) || newStartTime.equals(newEndTime)) {
                throw new AppException(ErrorCode.SHIFT_INVALID_TIME_RANGE);
            }
            
            // Check for overlapping shifts (excluding current shift)
            String branchId = workShift.getBranch() != null ? workShift.getBranch().getId() : null;
            validateNoOverlappingShifts(newStartTime, newEndTime, branchId, id);
            
            workShift.setStartTime(newStartTime);
            workShift.setEndTime(newEndTime);
        }
        
        // Update color code
        if (request.getColorCode() != null) {
            workShift.setColorCode(request.getColorCode());
        }
        
        WorkShift updated = workShiftRepository.save(workShift);
        log.info("Work shift updated successfully: {}", id);
        
        return workShiftMapper.toResponse(updated);
    }
    
    @Override
    @Transactional(readOnly = true)
    public WorkShiftResponse getWorkShift(String id) {
        WorkShift workShift = workShiftRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
        return workShiftMapper.toResponse(workShift);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WorkShiftResponse> getAllActiveShifts() {
        List<WorkShift> shifts = workShiftRepository.findAllActiveShifts();
        return shifts.stream()
            .map(workShiftMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WorkShiftResponse> getShiftsByBranch(String branchId) {
        if (!branchRepository.existsById(branchId)) {
            throw new AppException(ErrorCode.HOTEL_NOT_FOUND);
        }
        
        List<WorkShift> shifts = workShiftRepository.findActiveShiftsByBranch(branchId);
        return shifts.stream()
            .map(workShiftMapper::toResponse)
            .toList();
    }
    
    @Override
    public void deleteWorkShift(String id) {
        log.info("Deleting work shift: {}", id);
        
        WorkShift workShift = workShiftRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
        
        // Soft delete
        workShift.setActive(false);
        workShiftRepository.save(workShift);
        
        log.info("Work shift deleted successfully: {}", id);
    }
    
    @Override
    public WorkShiftResponse toggleShiftStatus(String id, boolean active) {
        log.info("Toggling shift status: {}", id);
        
        WorkShift workShift = workShiftRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
        
        workShift.setActive(active);
        WorkShift updated = workShiftRepository.save(workShift);
        
        log.info("Shift status toggled to: {}", updated.getActive());
        return workShiftMapper.toResponse(updated);
    }
    
    /**
     * Validate that new shift doesn't overlap with existing shifts in the same branch
     */
    private void validateNoOverlappingShifts(LocalTime startTime, LocalTime endTime, 
                                            String branchId, String excludeShiftId) {
        List<WorkShift> existingShifts;
        
        if (branchId != null) {
            existingShifts = workShiftRepository.findActiveShiftsByBranch(branchId);
        } else {
            existingShifts = workShiftRepository.findAllActiveShifts();
        }
        
        for (WorkShift shift : existingShifts) {
            // Skip if this is the current shift being updated
            if (excludeShiftId != null && shift.getId().equals(excludeShiftId)) {
                continue;
            }
            
            // Only check shifts in the same scope (branch or global)
            boolean sameScope = (branchId == null && shift.getBranch() == null) ||
                              (branchId != null && shift.getBranch() != null && 
                               shift.getBranch().getId().equals(branchId));
            
            if (!sameScope) {
                continue;
            }
            
            // Check for overlap
            if (timesOverlap(startTime, endTime, shift.getStartTime(), shift.getEndTime())) {
                throw new AppException(ErrorCode.SHIFT_TIME_OVERLAP);
            }
        }
    }
    
    /**
     * Check if two time ranges overlap
     */
    private boolean timesOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }
}

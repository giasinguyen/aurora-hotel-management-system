package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.BulkShiftAssignmentRequest;
import com.aurora.backend.dto.request.StaffShiftAssignmentRequest;
import com.aurora.backend.dto.response.StaffShiftAssignmentResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.StaffShiftAssignment;
import com.aurora.backend.entity.User;
import com.aurora.backend.entity.WorkShift;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.enums.ShiftAssignmentStatus;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.StaffShiftMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.StaffShiftAssignmentRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.repository.WorkShiftRepository;
import com.aurora.backend.service.StaffShiftService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StaffShiftServiceImpl implements StaffShiftService {
    
    private final StaffShiftAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final WorkShiftRepository workShiftRepository;
    private final BranchRepository branchRepository;
    private final StaffShiftMapper staffShiftMapper;
    
    @Override
    public StaffShiftAssignmentResponse assignShift(StaffShiftAssignmentRequest request) {
        log.info("Assigning shift {} to staff {} for date {}", 
            request.getWorkShiftId(), request.getStaffId(), request.getShiftDate());
        
        // Validate future date or today
        if (request.getShiftDate().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.ASSIGNMENT_DATE_PAST);
        }
        
        // Fetch entities
        User staff = userRepository.findById(request.getStaffId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        WorkShift workShift = workShiftRepository.findById(request.getWorkShiftId())
            .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
        
        if (!workShift.getActive()) {
            throw new AppException(ErrorCode.SHIFT_INACTIVE);
        }
        
        Branch branch = branchRepository.findById(request.getBranchId())
            .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        
        User assignedBy = userRepository.findById(request.getAssignedById())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Check for duplicate assignment
        boolean exists = assignmentRepository.existsByStaff_IdAndShiftDateAndWorkShift_Id(
            staff.getId(), request.getShiftDate(), workShift.getId());
        
        if (exists) {
            throw new AppException(ErrorCode.ASSIGNMENT_ALREADY_EXISTS);
        }
        
        // Check for overlapping shifts on the same date
        List<StaffShiftAssignment> existingAssignments = assignmentRepository
            .findByUserAndShiftDate(staff, request.getShiftDate());
        
        for (StaffShiftAssignment existing : existingAssignments) {
            if (existing.getStatus() != ShiftAssignmentStatus.CANCELLED) {
                WorkShift existingShift = existing.getWorkShift();
                if (shiftsOverlap(workShift, existingShift)) {
                    throw new AppException(ErrorCode.ASSIGNMENT_OVERLAP);
                }
            }
        }
        
        // Create assignment
        StaffShiftAssignment assignment = StaffShiftAssignment.builder()
            .staff(staff)
            .workShift(workShift)
            .shiftDate(request.getShiftDate())
            .status(ShiftAssignmentStatus.SCHEDULED)
            .branch(branch)
            .assignedBy(assignedBy)
            .notes(request.getNotes())
            .build();
        
        StaffShiftAssignment saved = assignmentRepository.save(assignment);
        log.info("Shift assigned successfully with ID: {}", saved.getId());
        
        return staffShiftMapper.toResponse(saved);
    }
    
    @Override
    public List<StaffShiftAssignmentResponse> bulkAssignShifts(BulkShiftAssignmentRequest request) {
        log.info("Bulk assigning shifts for {} staff members", request.getStaffIds().size());
        
        List<StaffShiftAssignmentResponse> responses = new ArrayList<>();
        
        // Validate date range
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new AppException(ErrorCode.INVALID_DATE_RANGE);
        }
        
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.ASSIGNMENT_DATE_PAST);
        }
        
        // Fetch common entities
        WorkShift workShift = workShiftRepository.findById(request.getWorkShiftId())
            .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
        
        Branch branch = branchRepository.findById(request.getBranchId())
            .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        
        User assignedBy = userRepository.findById(request.getAssignedById())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Iterate through dates and staff
        for (String staffId : request.getStaffIds()) {
            User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            
            LocalDate currentDate = request.getStartDate();
            while (!currentDate.isAfter(request.getEndDate())) {
                // Check if already assigned
                boolean exists = assignmentRepository.existsByStaff_IdAndShiftDateAndWorkShift_Id(
                    staffId, currentDate, workShift.getId());
                
                if (!exists) {
                    StaffShiftAssignment assignment = StaffShiftAssignment.builder()
                        .staff(staff)
                        .workShift(workShift)
                        .shiftDate(currentDate)
                        .status(ShiftAssignmentStatus.SCHEDULED)
                        .branch(branch)
                        .assignedBy(assignedBy)
                        .notes(request.getNotes())
                        .build();
                    
                    StaffShiftAssignment saved = assignmentRepository.save(assignment);
                    responses.add(staffShiftMapper.toResponse(saved));
                }
                
                currentDate = currentDate.plusDays(1);
            }
        }
        
        log.info("Bulk assignment completed. Created {} assignments", responses.size());
        return responses;
    }
    
    @Override
    public StaffShiftAssignmentResponse updateAssignment(String id, StaffShiftAssignmentRequest request) {
        log.info("Updating shift assignment: {}", id);
        
        StaffShiftAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        
        // Can only update if not completed or cancelled
        if (assignment.getStatus() == ShiftAssignmentStatus.COMPLETED ||
            assignment.getStatus() == ShiftAssignmentStatus.CANCELLED) {
            throw new AppException(ErrorCode.ASSIGNMENT_COMPLETED);
        }
        
        // Update shift date if provided
        if (request.getShiftDate() != null && !request.getShiftDate().equals(assignment.getShiftDate())) {
            if (request.getShiftDate().isBefore(LocalDate.now())) {
                throw new AppException(ErrorCode.ASSIGNMENT_DATE_PAST);
            }
            assignment.setShiftDate(request.getShiftDate());
        }
        
        // Update work shift if provided
        if (request.getWorkShiftId() != null && 
            !request.getWorkShiftId().equals(assignment.getWorkShift().getId())) {
            WorkShift newShift = workShiftRepository.findById(request.getWorkShiftId())
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
            assignment.setWorkShift(newShift);
        }
        
        // Update notes
        if (request.getNotes() != null) {
            assignment.setNotes(request.getNotes());
        }
        
        StaffShiftAssignment updated = assignmentRepository.save(assignment);
        log.info("Shift assignment updated: {}", id);
        
        return staffShiftMapper.toResponse(updated);
    }
    
    @Override
    public void cancelAssignment(String id, String reason) {
        log.info("Cancelling shift assignment: {}", id);
        
        StaffShiftAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        
        if (assignment.getStatus() == ShiftAssignmentStatus.COMPLETED) {
            throw new AppException(ErrorCode.ASSIGNMENT_COMPLETED);
        }
        
        assignment.setStatus(ShiftAssignmentStatus.CANCELLED);
        assignment.setNotes(assignment.getNotes() != null ? 
            assignment.getNotes() + " | Cancelled: " + reason : "Cancelled: " + reason);
        
        assignmentRepository.save(assignment);
        log.info("Shift assignment cancelled: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public StaffShiftAssignmentResponse getAssignment(String id) {
        StaffShiftAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        return staffShiftMapper.toResponse(assignment);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StaffShiftAssignmentResponse> getStaffShiftsForDate(String staffId, LocalDate date) {
        User staff = userRepository.findById(staffId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        List<StaffShiftAssignment> assignments = assignmentRepository
            .findByUserAndShiftDate(staff, date);
        
        return assignments.stream()
            .map(staffShiftMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StaffShiftAssignmentResponse> getStaffShiftsInRange(
            String staffId, LocalDate startDate, LocalDate endDate) {
        User staff = userRepository.findById(staffId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        List<StaffShiftAssignment> assignments = assignmentRepository
            .findByUserAndShiftDateBetween(staff, startDate, endDate);
        
        return assignments.stream()
            .map(staffShiftMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StaffShiftAssignmentResponse> getShiftsForDate(LocalDate date, String branchId) {
        List<StaffShiftAssignment> assignments;
        
        if (branchId != null) {
            Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
            assignments = assignmentRepository.findByShiftDateAndBranch(date, branch);
        } else {
            assignments = assignmentRepository.findByShiftDate(date);
        }
        
        return assignments.stream()
            .map(staffShiftMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StaffShiftAssignmentResponse> getShiftsInRange(
            LocalDate startDate, LocalDate endDate, String branchId) {
        List<StaffShiftAssignment> assignments;
        
        if (branchId != null) {
            Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
            assignments = assignmentRepository.findByShiftDateBetweenAndBranch(
                startDate, endDate, branch);
        } else {
            assignments = assignmentRepository.findByShiftDateBetween(startDate, endDate);
        }
        
        return assignments.stream()
            .map(staffShiftMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveShiftNow(String staffId) {
        User staff = userRepository.findById(staffId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        LocalDate today = LocalDate.now();
        List<StaffShiftAssignment> todayAssignments = assignmentRepository
            .findByUserAndShiftDate(staff, today);
        
        return todayAssignments.stream()
            .anyMatch(StaffShiftAssignment::isActiveNow);
    }
    
    @Override
    @Transactional(readOnly = true)
    public StaffShiftAssignmentResponse getCurrentActiveShift(String staffId) {
        User staff = userRepository.findById(staffId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        LocalDate today = LocalDate.now();
        List<StaffShiftAssignment> todayAssignments = assignmentRepository
            .findByUserAndShiftDate(staff, today);
        
        return todayAssignments.stream()
            .filter(StaffShiftAssignment::isActiveNow)
            .findFirst()
            .map(staffShiftMapper::toResponse)
            .orElse(null);
    }
    
    @Override
    public StaffShiftAssignmentResponse updateAssignmentStatus(String id, ShiftAssignmentStatus status) {
        log.info("Updating assignment status to: {}", status);
        
        StaffShiftAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        
        assignment.setStatus(status);
        StaffShiftAssignment updated = assignmentRepository.save(assignment);
        
        return staffShiftMapper.toResponse(updated);
    }
    
    /**
     * Check if two shifts overlap in time
     */
    private boolean shiftsOverlap(WorkShift shift1, WorkShift shift2) {
        return shift1.getStartTime().isBefore(shift2.getEndTime()) && 
               shift2.getStartTime().isBefore(shift1.getEndTime());
    }
}

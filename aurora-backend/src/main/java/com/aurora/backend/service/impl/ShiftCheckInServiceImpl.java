package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.ShiftCheckInRequest;
import com.aurora.backend.dto.request.ShiftCheckOutRequest;
import com.aurora.backend.dto.response.ShiftCheckInResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.ShiftCheckIn;
import com.aurora.backend.entity.StaffShiftAssignment;
import com.aurora.backend.entity.User;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.enums.ShiftAssignmentStatus;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.ShiftCheckInMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.ShiftCheckInRepository;
import com.aurora.backend.repository.StaffShiftAssignmentRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.service.ShiftCheckInService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ShiftCheckInServiceImpl implements ShiftCheckInService {
    
    private final ShiftCheckInRepository checkInRepository;
    private final StaffShiftAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final ShiftCheckInMapper shiftCheckInMapper;
    
    private static final int LATE_THRESHOLD_MINUTES = 15; // Consider late after 15 minutes
    
    @Override
    public ShiftCheckInResponse checkIn(ShiftCheckInRequest request) {
        log.info("Processing check-in for assignment: {}", request.getAssignmentId());
        
        // Verify assignment exists
        StaffShiftAssignment assignment = assignmentRepository.findById(request.getAssignmentId())
            .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        
        // Verify assignment is for today
        if (!assignment.getShiftDate().equals(LocalDate.now())) {
            throw new AppException(ErrorCode.CHECKIN_WRONG_DATE);
        }
        
        // Verify assignment status
        if (assignment.getStatus() == ShiftAssignmentStatus.CANCELLED) {
            throw new AppException(ErrorCode.SHIFT_CANCELLED);
        }
        
        if (assignment.getStatus() == ShiftAssignmentStatus.COMPLETED) {
            throw new AppException(ErrorCode.SHIFT_CANCELLED);
        }
        
        // Check if already checked in
        Optional<ShiftCheckIn> existingCheckIn = checkInRepository
            .findByAssignmentAndCheckOutTimeIsNull(assignment);
        
        if (existingCheckIn.isPresent()) {
            // Auto check-out previous check-in to allow new check-in
            ShiftCheckIn oldCheckIn = existingCheckIn.get();
            log.warn("Found existing check-in for assignment {}. Auto checking out old check-in.", assignment.getId());
            oldCheckIn.setCheckOutTime(LocalDateTime.now());
            oldCheckIn.setNotes((oldCheckIn.getNotes() != null ? oldCheckIn.getNotes() + " | " : "") 
                + "Auto checked out due to new check-in");
            checkInRepository.save(oldCheckIn);
        }
        
        // Validate time is within reasonable range (not too early, can be late)
        LocalTime currentTime = LocalTime.now();
        LocalTime shiftStart = assignment.getWorkShift().getStartTime();
        LocalTime shiftEnd = assignment.getWorkShift().getEndTime();
        
        // Don't allow check-in more than 1 hour before shift starts
        if (currentTime.isBefore(shiftStart.minusHours(1))) {
            throw new AppException(ErrorCode.CHECKIN_TOO_EARLY);
        }
        
        // Calculate if late
        boolean isLate = currentTime.isAfter(shiftStart.plusMinutes(LATE_THRESHOLD_MINUTES));
        int lateMinutes = 0;
        
        if (isLate) {
            lateMinutes = (int) Duration.between(shiftStart, currentTime).toMinutes();
        }
        
        // Create check-in record
        ShiftCheckIn checkIn = ShiftCheckIn.builder()
            .assignment(assignment)
            .staff(assignment.getStaff())
            .checkInTime(LocalDateTime.now())
            .isLate(isLate)
            .lateMinutes(isLate ? lateMinutes : null)
            .ipAddress(request.getIpAddress())
            .deviceInfo(request.getDeviceInfo())
            .location(request.getLocation())
            .notes(request.getNotes())
            .build();
        
        // Update assignment status to IN_PROGRESS
        assignment.setStatus(ShiftAssignmentStatus.IN_PROGRESS);
        assignmentRepository.save(assignment);
        
        ShiftCheckIn saved = checkInRepository.save(checkIn);
        log.info("Check-in successful. Late: {}, Minutes: {}", isLate, lateMinutes);
        
        return shiftCheckInMapper.toResponse(saved);
    }
    
    @Override
    public ShiftCheckInResponse checkOut(ShiftCheckOutRequest request) {
        log.info("Processing check-out for assignment: {}", request.getAssignmentId());
        
        // Verify assignment exists
        StaffShiftAssignment assignment = assignmentRepository.findById(request.getAssignmentId())
            .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        
        // Find active check-in
        ShiftCheckIn checkIn = checkInRepository
            .findByAssignmentAndCheckOutTimeIsNull(assignment)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_CHECKED_IN));
        
        // Set check-out time
        LocalDateTime checkOutTime = LocalDateTime.now();
        checkIn.setCheckOutTime(checkOutTime);
        
        // Calculate if early departure
        LocalTime currentTime = checkOutTime.toLocalTime();
        LocalTime shiftEnd = assignment.getWorkShift().getEndTime();
        
        boolean isEarlyDeparture = currentTime.isBefore(shiftEnd.minusMinutes(LATE_THRESHOLD_MINUTES));
        int earlyMinutes = 0;
        
        if (isEarlyDeparture) {
            earlyMinutes = (int) Duration.between(currentTime, shiftEnd).toMinutes();
            checkIn.setIsEarlyDeparture(true);
            checkIn.setEarlyDepartureMinutes(earlyMinutes);
        }
        
        // Add notes if provided
        if (request.getNotes() != null) {
            String existingNotes = checkIn.getNotes() != null ? checkIn.getNotes() + " | " : "";
            checkIn.setNotes(existingNotes + request.getNotes());
        }
        
        // Update assignment status to COMPLETED
        assignment.setStatus(ShiftAssignmentStatus.COMPLETED);
        assignmentRepository.save(assignment);
        
        ShiftCheckIn updated = checkInRepository.save(checkIn);
        log.info("Check-out successful. Early: {}, Minutes: {}, Working hours: {}", 
            isEarlyDeparture, earlyMinutes, checkIn.getWorkingHours());
        
        return shiftCheckInMapper.toResponse(updated);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ShiftCheckInResponse getCheckInRecord(String id) {
        ShiftCheckIn checkIn = checkInRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.CHECKIN_NOT_FOUND));
        return shiftCheckInMapper.toResponse(checkIn);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ShiftCheckInResponse> getCheckInsByAssignment(String assignmentId) {
        StaffShiftAssignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        
        List<ShiftCheckIn> checkIns = checkInRepository.findByAssignment(assignment);
        return checkIns.stream()
            .map(shiftCheckInMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ShiftCheckInResponse> getStaffCheckIns(
            String staffId, LocalDate startDate, LocalDate endDate) {
        User staff = userRepository.findById(staffId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        List<ShiftCheckIn> checkIns = checkInRepository
            .findByStaffInDateRange(staff, startDate, endDate);
        
        return checkIns.stream()
            .map(shiftCheckInMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ShiftCheckInResponse> getBranchCheckIns(
            String branchId, LocalDate startDate, LocalDate endDate) {
        Branch branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        
        List<ShiftCheckIn> checkIns = checkInRepository
            .findByBranchInDateRange(branch, startDate, endDate);
        
        return checkIns.stream()
            .map(shiftCheckInMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isStaffCheckedIn(String staffId) {
        User staff = userRepository.findById(staffId)
            .orElse(null);
        
        if (staff == null) {
            return false;
        }
        
        return checkInRepository.findCurrentCheckIn(staff, LocalDate.now()).isPresent();
    }
    
    @Override
    @Transactional(readOnly = true)
    public ShiftCheckInResponse getCurrentCheckIn(String staffId) {
        User staff = userRepository.findById(staffId)
            .orElse(null);
        
        if (staff == null) {
            return null;
        }
        
        return checkInRepository.findCurrentCheckIn(staff, LocalDate.now())
            .map(shiftCheckInMapper::toResponse)
            .orElse(null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Double getTotalWorkingHours(String staffId, LocalDate startDate, LocalDate endDate) {
        User staff = userRepository.findById(staffId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        Double total = checkInRepository.getTotalWorkingHours(staff, startDate, endDate);
        return total != null ? total : 0.0;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ShiftCheckInResponse> getLateCheckIns(
            LocalDate startDate, LocalDate endDate, String branchId) {
        List<ShiftCheckIn> lateCheckIns;
        
        if (branchId != null) {
            Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
            lateCheckIns = checkInRepository.findLateCheckIns(startDate, endDate, branch);
        } else {
            lateCheckIns = checkInRepository.findLateCheckIns(startDate, endDate, null);
        }
        
        return lateCheckIns.stream()
            .map(shiftCheckInMapper::toResponse)
            .toList();
    }
}

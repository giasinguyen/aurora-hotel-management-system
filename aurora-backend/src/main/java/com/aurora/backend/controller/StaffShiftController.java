package com.aurora.backend.controller;

import com.aurora.backend.dto.request.BulkShiftAssignmentRequest;
import com.aurora.backend.dto.request.StaffShiftAssignmentRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.StaffShiftAssignmentResponse;
import com.aurora.backend.enums.ShiftAssignmentStatus;
import com.aurora.backend.service.StaffShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/shift-assignments")
@RequiredArgsConstructor
public class StaffShiftController {
    
    private final StaffShiftService staffShiftService;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StaffShiftAssignmentResponse>> assignShift(
            @Valid @RequestBody StaffShiftAssignmentRequest request) {
        
        StaffShiftAssignmentResponse response = staffShiftService.assignShift(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<StaffShiftAssignmentResponse>builder()
                .message("Shift assigned successfully")
                .result(response)
                .build()
        );
    }
    
    @PostMapping("/bulk")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StaffShiftAssignmentResponse>>> bulkAssignShifts(
            @Valid @RequestBody BulkShiftAssignmentRequest request) {
        
        List<StaffShiftAssignmentResponse> responses = staffShiftService.bulkAssignShifts(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<List<StaffShiftAssignmentResponse>>builder()
                .message(String.format("Successfully assigned %d shifts", responses.size()))
                .result(responses)
                .build()
        );
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StaffShiftAssignmentResponse>> updateAssignment(
            @PathVariable String id,
            @Valid @RequestBody StaffShiftAssignmentRequest request) {
        
        StaffShiftAssignmentResponse response = staffShiftService.updateAssignment(id, request);
        return ResponseEntity.ok(
            ApiResponse.<StaffShiftAssignmentResponse>builder()
                .message("Shift assignment updated successfully")
                .result(response)
                .build()
        );
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> cancelAssignment(
            @PathVariable String id,
            @RequestParam(required = false) String reason) {
        
        staffShiftService.cancelAssignment(id, reason != null ? reason : "Cancelled by manager");
        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .message("Shift assignment cancelled successfully")
                .build()
        );
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StaffShiftAssignmentResponse>> getAssignment(
            @PathVariable String id) {
        
        StaffShiftAssignmentResponse response = staffShiftService.getAssignment(id);
        return ResponseEntity.ok(
            ApiResponse.<StaffShiftAssignmentResponse>builder()
                .message("Shift assignment retrieved successfully")
                .result(response)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StaffShiftAssignmentResponse>>> getStaffShiftsForDate(
            @PathVariable String staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<StaffShiftAssignmentResponse> responses = staffShiftService.getStaffShiftsForDate(staffId, date);
        return ResponseEntity.ok(
            ApiResponse.<List<StaffShiftAssignmentResponse>>builder()
                .message("Staff shifts retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}/range")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StaffShiftAssignmentResponse>>> getStaffShiftsInRange(
            @PathVariable String staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<StaffShiftAssignmentResponse> responses = staffShiftService
            .getStaffShiftsInRange(staffId, startDate, endDate);
        
        return ResponseEntity.ok(
            ApiResponse.<List<StaffShiftAssignmentResponse>>builder()
                .message("Staff shifts retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/date")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StaffShiftAssignmentResponse>>> getShiftsForDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String branchId) {
        
        List<StaffShiftAssignmentResponse> responses = staffShiftService.getShiftsForDate(date, branchId);
        return ResponseEntity.ok(
            ApiResponse.<List<StaffShiftAssignmentResponse>>builder()
                .message("Shift assignments retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/range")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StaffShiftAssignmentResponse>>> getShiftsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String branchId) {
        
        List<StaffShiftAssignmentResponse> responses = staffShiftService
            .getShiftsInRange(startDate, endDate, branchId);
        
        return ResponseEntity.ok(
            ApiResponse.<List<StaffShiftAssignmentResponse>>builder()
                .message("Shift assignments retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StaffShiftAssignmentResponse>> getCurrentActiveShift(
            @PathVariable String staffId) {
        
        StaffShiftAssignmentResponse response = staffShiftService.getCurrentActiveShift(staffId);
        return ResponseEntity.ok(
            ApiResponse.<StaffShiftAssignmentResponse>builder()
                .message(response != null ? "Current shift retrieved" : "No active shift")
                .result(response)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}/has-active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Boolean>> hasActiveShiftNow(@PathVariable String staffId) {
        boolean hasActive = staffShiftService.hasActiveShiftNow(staffId);
        return ResponseEntity.ok(
            ApiResponse.<Boolean>builder()
                .message(hasActive ? "Staff has active shift" : "No active shift")
                .result(hasActive)
                .build()
        );
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StaffShiftAssignmentResponse>> updateAssignmentStatus(
            @PathVariable String id,
            @RequestParam ShiftAssignmentStatus status) {
        
        StaffShiftAssignmentResponse response = staffShiftService.updateAssignmentStatus(id, status);
        return ResponseEntity.ok(
            ApiResponse.<StaffShiftAssignmentResponse>builder()
                .message("Assignment status updated successfully")
                .result(response)
                .build()
        );
    }
}


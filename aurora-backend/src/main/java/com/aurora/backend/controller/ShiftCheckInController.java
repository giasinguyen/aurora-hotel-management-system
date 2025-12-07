package com.aurora.backend.controller;

import com.aurora.backend.dto.request.ShiftCheckInRequest;
import com.aurora.backend.dto.request.ShiftCheckOutRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.ShiftCheckInResponse;
import com.aurora.backend.service.ShiftCheckInService;
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
@RequestMapping("/api/v1/shift-checkins")
@RequiredArgsConstructor
public class ShiftCheckInController {
    
    private final ShiftCheckInService shiftCheckInService;
    
    @PostMapping("/check-in")
    @PreAuthorize("hasAnyAuthority('SHIFT_CHECKIN', 'ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<ShiftCheckInResponse>> checkIn(
            @Valid @RequestBody ShiftCheckInRequest request) {
        
        ShiftCheckInResponse response = shiftCheckInService.checkIn(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<ShiftCheckInResponse>builder()
                .message(response.getIsLate() ? 
                    String.format("Checked in (Late by %d minutes)", response.getLateMinutes()) : 
                    "Checked in successfully")
                .result(response)
                .build()
        );
    }
    
    @PostMapping("/check-out")
    @PreAuthorize("hasAnyAuthority('SHIFT_CHECKOUT', 'ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<ShiftCheckInResponse>> checkOut(
            @Valid @RequestBody ShiftCheckOutRequest request) {
        
        ShiftCheckInResponse response = shiftCheckInService.checkOut(request);
        return ResponseEntity.ok(
            ApiResponse.<ShiftCheckInResponse>builder()
                .message(String.format("Checked out successfully. Working hours: %.2f", 
                    response.getWorkingHours()))
                .result(response)
                .build()
        );
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ShiftCheckInResponse>> getCheckInRecord(
            @PathVariable String id) {
        
        ShiftCheckInResponse response = shiftCheckInService.getCheckInRecord(id);
        return ResponseEntity.ok(
            ApiResponse.<ShiftCheckInResponse>builder()
                .message("Check-in record retrieved successfully")
                .result(response)
                .build()
        );
    }
    
    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<ShiftCheckInResponse>>> getCheckInsByAssignment(
            @PathVariable String assignmentId) {
        
        List<ShiftCheckInResponse> responses = shiftCheckInService.getCheckInsByAssignment(assignmentId);
        return ResponseEntity.ok(
            ApiResponse.<List<ShiftCheckInResponse>>builder()
                .message("Check-in records retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'SHIFT_VIEW_OWN', 'ADMIN', 'MANAGER') or (#staffId == authentication.principal.claims['userId'])")
    public ResponseEntity<ApiResponse<List<ShiftCheckInResponse>>> getStaffCheckIns(
            @PathVariable String staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<ShiftCheckInResponse> responses = shiftCheckInService
            .getStaffCheckIns(staffId, startDate, endDate);
        
        return ResponseEntity.ok(
            ApiResponse.<List<ShiftCheckInResponse>>builder()
                .message("Check-in records retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ShiftCheckInResponse>>> getBranchCheckIns(
            @PathVariable String branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<ShiftCheckInResponse> responses = shiftCheckInService
            .getBranchCheckIns(branchId, startDate, endDate);
        
        return ResponseEntity.ok(
            ApiResponse.<List<ShiftCheckInResponse>>builder()
                .message("Check-in records retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}/is-checked-in")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'SHIFT_VIEW_OWN', 'ADMIN', 'MANAGER') or (#staffId == authentication.principal.claims['userId'])")
    public ResponseEntity<ApiResponse<Boolean>> isStaffCheckedIn(@PathVariable String staffId) {
        boolean isCheckedIn = shiftCheckInService.isStaffCheckedIn(staffId);
        return ResponseEntity.ok(
            ApiResponse.<Boolean>builder()
                .message(isCheckedIn ? "Staff is checked in" : "Staff is not checked in")
                .result(isCheckedIn)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}/current")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'SHIFT_VIEW_OWN', 'ADMIN', 'MANAGER') or (#staffId == authentication.principal.claims['userId'])")
    public ResponseEntity<ApiResponse<ShiftCheckInResponse>> getCurrentCheckIn(
            @PathVariable String staffId) {
        
        ShiftCheckInResponse response = shiftCheckInService.getCurrentCheckIn(staffId);
        return ResponseEntity.ok(
            ApiResponse.<ShiftCheckInResponse>builder()
                .message(response != null ? "Current check-in retrieved" : "No active check-in")
                .result(response)
                .build()
        );
    }
    
    @GetMapping("/staff/{staffId}/total-hours")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'SHIFT_VIEW_OWN', 'ADMIN', 'MANAGER') or (#staffId == authentication.principal.claims['userId'])")
    public ResponseEntity<ApiResponse<Double>> getTotalWorkingHours(
            @PathVariable String staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Double totalHours = shiftCheckInService.getTotalWorkingHours(staffId, startDate, endDate);
        return ResponseEntity.ok(
            ApiResponse.<Double>builder()
                .message(String.format("Total working hours: %.2f", totalHours))
                .result(totalHours)
                .build()
        );
    }
    
    @GetMapping("/late")
    @PreAuthorize("hasAnyAuthority('SHIFT_VIEW', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ShiftCheckInResponse>>> getLateCheckIns(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String branchId) {
        
        List<ShiftCheckInResponse> responses = shiftCheckInService
            .getLateCheckIns(startDate, endDate, branchId);
        
        return ResponseEntity.ok(
            ApiResponse.<List<ShiftCheckInResponse>>builder()
                .message(String.format("Found %d late check-ins", responses.size()))
                .result(responses)
                .build()
        );
    }
}

package com.aurora.backend.controller;

import com.aurora.backend.dto.request.WorkShiftCreationRequest;
import com.aurora.backend.dto.request.WorkShiftUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.WorkShiftResponse;
import com.aurora.backend.service.WorkShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shifts")
@RequiredArgsConstructor
public class WorkShiftController {
    
    private final WorkShiftService workShiftService;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<WorkShiftResponse>> createShift(
            @Valid @RequestBody WorkShiftCreationRequest request) {
        
        WorkShiftResponse response = workShiftService.createWorkShift(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<WorkShiftResponse>builder()
                .message("Work shift created successfully")
                .result(response)
                .build()
        );
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<WorkShiftResponse>> updateShift(
            @PathVariable String id,
            @Valid @RequestBody WorkShiftUpdateRequest request) {
        
        WorkShiftResponse response = workShiftService.updateWorkShift(id, request);
        return ResponseEntity.ok(
            ApiResponse.<WorkShiftResponse>builder()
                .message("Work shift updated successfully")
                .result(response)
                .build()
        );
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<WorkShiftResponse>> getShift(@PathVariable String id) {
        WorkShiftResponse response = workShiftService.getWorkShift(id);
        return ResponseEntity.ok(
            ApiResponse.<WorkShiftResponse>builder()
                .message("Work shift retrieved successfully")
                .result(response)
                .build()
        );
    }
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<WorkShiftResponse>>> getAllActiveShifts() {
        List<WorkShiftResponse> responses = workShiftService.getAllActiveShifts();
        return ResponseEntity.ok(
            ApiResponse.<List<WorkShiftResponse>>builder()
                .message("Work shifts retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @GetMapping("/branch/{branchId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<WorkShiftResponse>>> getShiftsByBranch(
            @PathVariable String branchId) {
        List<WorkShiftResponse> responses = workShiftService.getShiftsByBranch(branchId);
        return ResponseEntity.ok(
            ApiResponse.<List<WorkShiftResponse>>builder()
                .message("Branch shifts retrieved successfully")
                .result(responses)
                .build()
        );
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteShift(@PathVariable String id) {
        workShiftService.deleteWorkShift(id);
        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .message("Work shift deleted successfully")
                .build()
        );
    }
    
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<WorkShiftResponse>> toggleShiftStatus(
            @PathVariable String id,
            @RequestParam boolean active) {
        WorkShiftResponse response = workShiftService.toggleShiftStatus(id, active);
        return ResponseEntity.ok(
            ApiResponse.<WorkShiftResponse>builder()
                .message("Shift status toggled successfully")
                .result(response)
                .build()
        );
    }
}

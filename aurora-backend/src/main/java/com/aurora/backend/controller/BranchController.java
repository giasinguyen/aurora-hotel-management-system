package com.aurora.backend.controller;

import com.aurora.backend.dto.request.BranchCreationRequest;
import com.aurora.backend.dto.request.BranchUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.BranchResponse;
import com.aurora.backend.entity.Branch.BranchStatus;
import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.service.BranchService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/branches")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BranchController {
    
    BranchService branchService;

    @PostMapping
    @RequirePermission(PermissionConstants.Admin.BRANCH_CREATE)
    public ApiResponse<BranchResponse> createBranch(@RequestBody @Valid BranchCreationRequest request) {
        log.info("Creating branch with code: {}", request.getCode());
        return ApiResponse.<BranchResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Branch created successfully")
                .result(branchService.createBranch(request))
                .build();
    }

    @GetMapping
    @RequirePermission(PermissionConstants.Manager.BRANCH_VIEW)
    public ApiResponse<Page<BranchResponse>> getAllBranches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        log.info("Fetching all branches - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return ApiResponse.<Page<BranchResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(branchService.getAllBranches(pageable))
                .build();
    }

    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Manager.BRANCH_VIEW)
    public ApiResponse<BranchResponse> getBranchById(@PathVariable String id) {
        log.info("Fetching branch by ID: {}", id);
        return ApiResponse.<BranchResponse>builder()
                .code(HttpStatus.OK.value())
                .result(branchService.getBranchById(id))
                .build();
    }

    @GetMapping("/code/{code}")
    @RequirePermission(PermissionConstants.Manager.BRANCH_VIEW)
    public ApiResponse<BranchResponse> getBranchByCode(@PathVariable String code) {
        log.info("Fetching branch by code: {}", code);
        return ApiResponse.<BranchResponse>builder()
                .code(HttpStatus.OK.value())
                .result(branchService.getBranchByCode(code))
                .build();
    }

    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.BRANCH_UPDATE)
    public ApiResponse<BranchResponse> updateBranch(
            @PathVariable String id,
            @RequestBody @Valid BranchUpdateRequest request) {
        log.info("Updating branch with ID: {}", id);
        return ApiResponse.<BranchResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Branch updated successfully")
                .result(branchService.updateBranch(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.BRANCH_DELETE)
    public ApiResponse<Void> deleteBranch(@PathVariable String id) {
        log.info("Deleting branch with ID: {}", id);
        branchService.deleteBranch(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .message("Branch deleted successfully")
                .build();
    }

    @GetMapping("/search")
    @RequirePermission(PermissionConstants.Manager.BRANCH_VIEW)
    public ApiResponse<Page<BranchResponse>> searchBranches(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Searching branches with keyword: {}", keyword);
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BranchResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(branchService.searchBranches(keyword, pageable))
                .build();
    }

    @GetMapping("/city/{city}")
    @RequirePermission(PermissionConstants.Manager.BRANCH_VIEW)
    public ApiResponse<Page<BranchResponse>> getBranchesByCity(
            @PathVariable String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching branches by city: {}", city);
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BranchResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(branchService.getBranchesByCity(city, pageable))
                .build();
    }

    @GetMapping("/status/{status}")
    @RequirePermission(PermissionConstants.Manager.BRANCH_VIEW)
    public ApiResponse<Page<BranchResponse>> getBranchesByStatus(
            @PathVariable BranchStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching branches by status: {}", status);
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BranchResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(branchService.getBranchesByStatus(status, pageable))
                .build();
    }

    @PutMapping("/{branchId}/manager")
    @RequirePermission(PermissionConstants.Admin.BRANCH_ASSIGN_MANAGER)
    public ApiResponse<BranchResponse> assignManager(
            @PathVariable String branchId,
            @RequestBody Map<String, String> request) {
        String managerId = request.get("managerId");
        log.info("Assigning manager {} to branch {}", managerId, branchId);
        return ApiResponse.<BranchResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Manager assigned successfully")
                .result(branchService.assignManager(branchId, managerId))
                .build();
    }

    @DeleteMapping("/{branchId}/manager")
    @RequirePermission(PermissionConstants.Admin.BRANCH_REMOVE_MANAGER)
    public ApiResponse<BranchResponse> removeManager(@PathVariable String branchId) {
        log.info("Removing manager from branch {}", branchId);
        return ApiResponse.<BranchResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Manager removed successfully")
                .result(branchService.removeManager(branchId))
                .build();
    }

    @GetMapping("/{id}/statistics")
    @RequirePermission(PermissionConstants.Manager.BRANCH_VIEW_STATS)
    public ApiResponse<BranchResponse> getBranchStatistics(@PathVariable String id) {
        log.info("Fetching statistics for branch {}", id);
        return ApiResponse.<BranchResponse>builder()
                .code(HttpStatus.OK.value())
                .result(branchService.getBranchStatistics(id))
                .build();
    }
}

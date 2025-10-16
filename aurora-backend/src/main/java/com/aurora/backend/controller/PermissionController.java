package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.PermissionCreationRequest;
import com.aurora.backend.dto.request.PermissionUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.PermissionResponse;
import com.aurora.backend.service.PermissionService;
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

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionController {
    
    PermissionService permissionService;

    // ADMIN ONLY - Tạo permission
    @PostMapping
    @RequirePermission(PermissionConstants.Admin.PERMISSION_MANAGE)
    public ApiResponse<PermissionResponse> createPermission(@Valid @RequestBody PermissionCreationRequest request) {
        PermissionResponse response = permissionService.createPermission(request);
        return ApiResponse.<PermissionResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Permission created successfully")
                .result(response)
                .build();
    }

    // ADMIN ONLY - Update permission
    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.PERMISSION_MANAGE)
    public ApiResponse<PermissionResponse> updatePermission(@PathVariable String id, @Valid @RequestBody PermissionUpdateRequest request) {
        PermissionResponse response = permissionService.updatePermission(id, request);
        return ApiResponse.<PermissionResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Permission updated successfully")
                .result(response)
                .build();
    }

    // ADMIN ONLY - Delete permission
    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.PERMISSION_MANAGE)
    public ApiResponse<Void> deletePermission(@PathVariable String id) {
        permissionService.deletePermission(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Permission deleted successfully")
                .build();
    }

    // ADMIN ONLY - Xem permission
    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.PERMISSION_MANAGE)
    public ApiResponse<PermissionResponse> getPermissionById(@PathVariable String id) {
        PermissionResponse response = permissionService.getPermissionById(id);
        return ApiResponse.<PermissionResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Permission retrieved successfully")
                .result(response)
                .build();
    }

    // ADMIN ONLY - Xem tất cả permissions
    @GetMapping
    @RequirePermission(PermissionConstants.Admin.PERMISSION_MANAGE)
    public ApiResponse<Page<PermissionResponse>> getAllPermissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "code") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PermissionResponse> response = permissionService.getAllPermissions(pageable);
        return ApiResponse.<Page<PermissionResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Permissions retrieved successfully")
                .result(response)
                .build();
    }

    // ADMIN ONLY - Search permissions
    @GetMapping("/search")
    @RequirePermission(PermissionConstants.Admin.PERMISSION_MANAGE)
    public ApiResponse<Page<PermissionResponse>> searchPermissions(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PermissionResponse> response = permissionService.searchPermissions(name, description, pageable);
        return ApiResponse.<Page<PermissionResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Permissions search completed successfully")
                .result(response)
                .build();
    }
}

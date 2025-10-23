package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.RoleCreationRequest;
import com.aurora.backend.dto.request.RoleUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.RoleResponse;
import com.aurora.backend.service.RoleService;
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
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleController {
    
    RoleService roleService;

    // ADMIN ONLY - Tạo role
    @PostMapping
    @RequirePermission(PermissionConstants.Admin.ROLE_CREATE)
    public ApiResponse<RoleResponse> createRole(@Valid @RequestBody RoleCreationRequest request) {
        RoleResponse response = roleService.createRole(request);
        return ApiResponse.<RoleResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Role created successfully")
                .result(response)
                .build();
    }

    // ADMIN ONLY - Update role
    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.ROLE_UPDATE)
    public ApiResponse<RoleResponse> updateRole(@PathVariable String id, @Valid @RequestBody RoleUpdateRequest request) {
        RoleResponse response = roleService.updateRole(id, request);
        return ApiResponse.<RoleResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Role updated successfully")
                .result(response)
                .build();
    }

    // ADMIN ONLY - Delete role
    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.ROLE_DELETE)
    public ApiResponse<Void> deleteRole(@PathVariable String id) {
        roleService.deleteRole(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Role deleted successfully")
                .build();
    }

    // ADMIN ONLY - Xem role
    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.ROLE_CREATE)
    public ApiResponse<RoleResponse> getRoleById(@PathVariable String id) {
        RoleResponse response = roleService.getRoleById(id);
        return ApiResponse.<RoleResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Role retrieved successfully")
                .result(response)
                .build();
    }

    // ADMIN ONLY - Xem tất cả roles
    @GetMapping
    @RequirePermission(PermissionConstants.Admin.ROLE_CREATE)
    public ApiResponse<Page<RoleResponse>> getAllRoles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<RoleResponse> response = roleService.getAllRoles(pageable);
        return ApiResponse.<Page<RoleResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Roles retrieved successfully")
                .result(response)
                .build();
    }
}

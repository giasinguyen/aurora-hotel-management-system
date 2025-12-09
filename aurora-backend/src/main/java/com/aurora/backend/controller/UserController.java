package com.aurora.backend.controller;


import java.util.List;
import java.util.Set;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.ProfileUpdateRequest;
import com.aurora.backend.dto.request.UserCreationRequest;
import com.aurora.backend.dto.request.UserRegistrationRequest;
import com.aurora.backend.dto.request.UserUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.UserResponse;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.service.UserService;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> registerUser(@RequestBody @Valid UserRegistrationRequest request) {
        log.info("User registration request for username: {}", request.getUsername());
        return ApiResponse.<UserResponse>builder()
                .result(userService.registerUser(request))
                .message("User registered successfully")
                .build();
    }

    @GetMapping("/myInfo")
    @RequirePermission(PermissionConstants.Customer.PROFILE_VIEW)
    ApiResponse<UserResponse> getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        log.info("Fetching current user info for: {}", currentUsername);
        
        return ApiResponse.<UserResponse>builder()
                .message("User info retrieved successfully")
                .result(userService.getUserByUsername(currentUsername))
                .build();
    }

    @PutMapping("/myInfo")
    @RequirePermission(PermissionConstants.Customer.PROFILE_UPDATE)
    ApiResponse<UserResponse> updateMyInfo(@RequestBody @Valid ProfileUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        log.info("Updating current user info for: {}", currentUsername);
        
        UserResponse currentUser = userService.getUserByUsername(currentUsername);
        
        return ApiResponse.<UserResponse>builder()
                .message("User info updated successfully")
                .result(userService.updateMyProfile(currentUser.getId(), request))
                .build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RequirePermission(PermissionConstants.Admin.USER_CREATE)
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest userCreationRequest) {
        log.info("Creating new user with username: {}", userCreationRequest.getUsername());
        return ApiResponse.<UserResponse>builder()
                .message("User created successfully")
                .result(userService.createUser(userCreationRequest))
                .build();
    }

    /**
     * Manager can create STAFF and CUSTOMER users
     * Staff can only create CUSTOMER users
     */
    @PostMapping("/create-limited")
    @ResponseStatus(HttpStatus.CREATED)
    @RequirePermission(value = {
            PermissionConstants.Manager.STAFF_CREATE,
            PermissionConstants.Manager.CUSTOMER_CREATE,
            PermissionConstants.Staff.CUSTOMER_CREATE
    }, logic = RequirePermission.LogicType.OR)
    ApiResponse<UserResponse> createUserLimited(
            @RequestBody @Valid UserCreationRequest userCreationRequest,
            Authentication authentication) {
        log.info("Creating new user (limited) with username: {}", userCreationRequest.getUsername());
        
        // Validate role restrictions - get first role from Set
        Set<String> requestedRoles = userCreationRequest.getRoles();
        String requestedRole = null;
        if (requestedRoles != null && !requestedRoles.isEmpty()) {
            requestedRole = requestedRoles.iterator().next().toUpperCase().replace("ROLE_", "");
        }
        
        boolean isManager = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STAFF"));
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        // Admin can create any role
        if (isAdmin) {
            return ApiResponse.<UserResponse>builder()
                    .message("User created successfully")
                    .result(userService.createUser(userCreationRequest))
                    .build();
        }
        
        // Manager can create STAFF and CUSTOMER
        if (isManager) {
            if (requestedRole != null && !requestedRole.equals("STAFF") && !requestedRole.equals("CUSTOMER")) {
                log.warn("Manager attempted to create user with role: {} - forbidden", requestedRole);
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        
        // Staff can only create CUSTOMER
        if (isStaff && !isManager) {
            if (requestedRole == null || !requestedRole.equals("CUSTOMER")) {
                log.warn("Staff attempted to create user with role: {} - forbidden", requestedRole);
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        
        return ApiResponse.<UserResponse>builder()
                .message("User created successfully")
                .result(userService.createUser(userCreationRequest))
                .build();
    }

    @GetMapping
    @RequirePermission({PermissionConstants.Admin.USER_VIEW})
    ApiResponse<List<UserResponse>> getAllUsers() {
        log.info("Fetching all users");
        return ApiResponse.<List<UserResponse>>builder()
                .message("Users retrieved successfully")
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/paginated")
    @RequirePermission({PermissionConstants.Admin.USER_VIEW, PermissionConstants.Manager.STAFF_VIEW})
    ApiResponse<Page<UserResponse>> getUsersWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("Fetching users with pagination - page: {}, size: {}, sortBy: {}, direction: {}", 
                page, size, sortBy, sortDirection);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<UserResponse>>builder()
                .message("Users paginated successfully")
                .result(userService.getUsersWithPagination(pageable))
                .build();
    }

    @GetMapping("/role/{roleName}")
    @RequirePermission({
        PermissionConstants.Admin.ROLE_CREATE,
        PermissionConstants.Manager.STAFF_VIEW,
        PermissionConstants.Staff.CUSTOMER_VIEW
    })
    ApiResponse<Page<UserResponse>> getUsersByRole(
            @PathVariable("roleName") String roleName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            Authentication authentication) {
        
        log.info("Fetching users with role: {} - page: {}, size: {}", roleName, page, size);
        
        // Validate Manager can only access STAFF and CUSTOMER roles
        if (authentication != null) {
            boolean isManager = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));
            boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (isManager && !isAdmin) {
                String normalizedRole = roleName.toUpperCase().replace("ROLE_", "");
                if (!normalizedRole.equals("STAFF") && !normalizedRole.equals("CUSTOMER")) {
                    log.warn("Manager attempted to access role: {} - forbidden", roleName);
                    throw new AppException(ErrorCode.UNAUTHORIZED);
                }
            }
        }
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<UserResponse>>builder()
                .message("Users by role retrieved successfully")
                .result(userService.getUsersByRoleName(roleName, pageable))
                .build();
    }

    @GetMapping("/{userId}")
    @RequirePermission({PermissionConstants.Admin.USER_VIEW, PermissionConstants.Manager.STAFF_VIEW, PermissionConstants.Customer.PROFILE_VIEW})
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        log.info("Fetching user with ID: {}", userId);
        
        UserResponse user = userService.getUser(userId);
        
        return ApiResponse.<UserResponse>builder()
                .message("User retrieved successfully")
                .result(user)
                .build();
    }

    @GetMapping("/username/{username}")
    @RequirePermission({PermissionConstants.Admin.USER_CREATE, PermissionConstants.Staff.CUSTOMER_VIEW})
    ApiResponse<UserResponse> getUserByUsername(@PathVariable("username") String username) {
        log.info("Fetching user with username: {}", username);
        return ApiResponse.<UserResponse>builder()
                .message("User retrieved successfully")
                .result(userService.getUserByUsername(username))
                .build();
    }

    @PutMapping("/{userId}")
    @RequirePermission({PermissionConstants.Admin.USER_UPDATE, PermissionConstants.Customer.PROFILE_UPDATE})
    ApiResponse<UserResponse> updateUser(
            @PathVariable("userId") String userId,
            @RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        log.info("Updating user with ID: {}", userId);
        
        return ApiResponse.<UserResponse>builder()
                .message("User updated successfully")
                .result(userService.updateUser(userId, userUpdateRequest))
                .build();
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequirePermission(PermissionConstants.Admin.USER_DELETE)
    ApiResponse<Void> deleteUser(@PathVariable("userId") String userId) {
        log.info("Deleting user with ID: {}", userId);
        userService.deleteUser(userId);
        return ApiResponse.<Void>builder()
                .message("User deleted successfully")
                .build();
    }

    @PatchMapping("/{userId}/status")
    @RequirePermission(PermissionConstants.Admin.USER_UPDATE)
    ApiResponse<UserResponse> toggleUserStatus(
            @PathVariable("userId") String userId,
            @RequestBody java.util.Map<String, Boolean> statusRequest) {
        log.info("Toggling user status for ID: {}", userId);
        Boolean active = statusRequest.get("active");
        if (active == null) {
            throw new com.aurora.backend.exception.AppException(
                com.aurora.backend.enums.ErrorCode.INVALID_KEY);
        }
        
        // Get current user and update status
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setActive(active);
        
        return ApiResponse.<UserResponse>builder()
                .message(active ? "User activated successfully" : "User deactivated successfully")
                .result(userService.updateUser(userId, updateRequest))
                .build();
    }

    @GetMapping("/search")
    @RequirePermission({PermissionConstants.Admin.USER_CREATE, PermissionConstants.Staff.CUSTOMER_VIEW})
    ApiResponse<Page<UserResponse>> searchUsers(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching users with username containing: {}", username);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<UserResponse>>builder()
                .message("Users searched successfully")
                .result(userService.searchUsersByUsername(username, pageable))
                .build();
    }

    // ========== Role Management Endpoints ==========
    
    @PostMapping("/{userId}/roles/{roleId}")
    @RequirePermission(PermissionConstants.Admin.ROLE_ASSIGN)
    ApiResponse<UserResponse> assignRoleToUser(
            @PathVariable("userId") String userId,
            @PathVariable("roleId") String roleId) {
        log.info("Assigning role {} to user {}", roleId, userId);
        UserResponse user = userService.assignRoleToUser(userId, roleId);
        return ApiResponse.<UserResponse>builder()
                .message("Role assigned successfully")
                .result(user)
                .build();
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    @RequirePermission(PermissionConstants.Admin.ROLE_ASSIGN)
    ApiResponse<UserResponse> removeRoleFromUser(
            @PathVariable("userId") String userId,
            @PathVariable("roleId") String roleId) {
        log.info("Removing role {} from user {}", roleId, userId);
        UserResponse user = userService.removeRoleFromUser(userId, roleId);
        return ApiResponse.<UserResponse>builder()
                .message("Role removed successfully")
                .result(user)
                .build();
    }

    // ========== Permission Management Endpoints ==========
    
    @GetMapping("/{userId}/permissions")
    @RequirePermission({PermissionConstants.Admin.PERMISSION_MANAGE, PermissionConstants.Admin.USER_VIEW})
    ApiResponse<List<String>> getUserPermissions(@PathVariable("userId") String userId) {
        log.info("Fetching disabled permissions for user {}", userId);
        List<String> disabledPermissions = userService.getUserDisabledPermissions(userId);
        return ApiResponse.<List<String>>builder()
                .message("User permissions retrieved successfully")
                .result(disabledPermissions)
                .build();
    }

    @PutMapping("/{userId}/permissions")
    @RequirePermission(PermissionConstants.Admin.PERMISSION_MANAGE)
    ApiResponse<UserResponse> updateUserPermissions(
            @PathVariable("userId") String userId,
            @RequestBody java.util.Map<String, Object> permissionRequest) {
        log.info("Updating permissions for user {}", userId);
        
        @SuppressWarnings("unchecked")
        List<String> disabledPermissions = (List<String>) permissionRequest.get("disabledPermissions");
        
        if (disabledPermissions == null) {
            disabledPermissions = new java.util.ArrayList<>();
        }
        
        UserResponse user = userService.updateUserPermissions(userId, disabledPermissions);
        return ApiResponse.<UserResponse>builder()
                .message("User permissions updated successfully")
                .result(user)
                .build();
    }
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequirePermission(PermissionConstants.Customer.PROFILE_UPDATE)
    public ApiResponse<UserResponse> uploadAvatar(@RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        // Gọi service để upload ảnh và lưu URL vào user
        UserResponse updatedUser = userService.uploadAvatar(currentUsername, file);

        return ApiResponse.<UserResponse>builder()
                .message("Avatar uploaded successfully")
                .result(updatedUser)
                .build();
    }
}
// Thêm vào UserController.java

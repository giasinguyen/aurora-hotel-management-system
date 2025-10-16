package com.aurora.backend.controller;


import java.util.List;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.UserCreationRequest;
import com.aurora.backend.dto.request.UserRegistrationRequest;
import com.aurora.backend.dto.request.UserUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.UserResponse;
import com.aurora.backend.service.UserService;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RequirePermission(PermissionConstants.Admin.USER_CREATE)
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest userCreationRequest) {
        log.info("Creating new user with username: {}", userCreationRequest.getUsername());
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(userCreationRequest))
                .build();
    }

    @GetMapping
    @RequirePermission({PermissionConstants.Admin.USER_CREATE, PermissionConstants.Manager.STAFF_VIEW})
    ApiResponse<List<UserResponse>> getAllUsers() {
        log.info("Fetching all users");
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/paginated")
    @RequirePermission({PermissionConstants.Admin.USER_CREATE, PermissionConstants.Manager.STAFF_VIEW})
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
                .result(userService.getUsersWithPagination(pageable))
                .build();
    }

    @GetMapping("/{userId}")
    @RequirePermission(PermissionConstants.Customer.PROFILE_VIEW)
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        log.info("Fetching user with ID: {}", userId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        UserResponse user = userService.getUser(userId);
        if (!user.getUsername().equals(currentUsername)) {
            throw new com.aurora.backend.exception.AppException(
                com.aurora.backend.enums.ErrorCode.UNAUTHORIZED);
        }
        
        return ApiResponse.<UserResponse>builder()
                .result(user)
                .build();
    }

    @GetMapping("/username/{username}")
    @RequirePermission({PermissionConstants.Admin.USER_CREATE, PermissionConstants.Staff.CUSTOMER_VIEW})
    ApiResponse<UserResponse> getUserByUsername(@PathVariable("username") String username) {
        log.info("Fetching user with username: {}", username);
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserByUsername(username))
                .build();
    }

    @PutMapping("/{userId}")
    @RequirePermission(PermissionConstants.Customer.PROFILE_UPDATE)
    ApiResponse<UserResponse> updateUser(
            @PathVariable("userId") String userId,
            @RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        log.info("Updating user with ID: {}", userId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        UserResponse user = userService.getUser(userId);
        if (!user.getUsername().equals(currentUsername)) {
            throw new com.aurora.backend.exception.AppException(
                com.aurora.backend.enums.ErrorCode.UNAUTHORIZED);
        }
        
        return ApiResponse.<UserResponse>builder()
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

    @GetMapping("/search")
    @RequirePermission({PermissionConstants.Admin.USER_CREATE, PermissionConstants.Staff.CUSTOMER_VIEW})
    ApiResponse<Page<UserResponse>> searchUsers(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching users with username containing: {}", username);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<UserResponse>>builder()
                .result(userService.searchUsersByUsername(username, pageable))
                .build();
    }
}

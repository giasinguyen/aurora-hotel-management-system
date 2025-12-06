package com.aurora.backend.service;

import com.aurora.backend.dto.request.ProfileUpdateRequest;
import com.aurora.backend.dto.request.UserCreationRequest;
import com.aurora.backend.dto.request.UserRegistrationRequest;
import com.aurora.backend.dto.request.UserUpdateRequest;
import com.aurora.backend.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);
    UserResponse createUser(UserCreationRequest request);
    List<UserResponse> getUsers();
    Page<UserResponse> getUsersWithPagination(Pageable pageable);
    Page<UserResponse> getUsersByRoleName(String roleName, Pageable pageable);
    UserResponse getUser(String id);
    UserResponse getUserByUsername(String username);
    UserResponse updateUser(String id, UserUpdateRequest request);
    UserResponse updateMyProfile(String id, ProfileUpdateRequest request);
    void deleteUser(String id);
    Page<UserResponse> searchUsersByUsername(String username, Pageable pageable);
    
    // Role management
    UserResponse assignRoleToUser(String userId, String roleId);
    UserResponse removeRoleFromUser(String userId, String roleId);
    
    // Permission management
    List<String> getUserDisabledPermissions(String userId);
    UserResponse updateUserPermissions(String userId, List<String> disabledPermissions);
    UserResponse uploadAvatar(String username, MultipartFile file);
}

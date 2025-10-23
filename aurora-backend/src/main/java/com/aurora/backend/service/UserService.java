package com.aurora.backend.service;

import com.aurora.backend.dto.request.UserCreationRequest;
import com.aurora.backend.dto.request.UserRegistrationRequest;
import com.aurora.backend.dto.request.UserUpdateRequest;
import com.aurora.backend.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);
    UserResponse createUser(UserCreationRequest request);
    List<UserResponse> getUsers();
    Page<UserResponse> getUsersWithPagination(Pageable pageable);
    UserResponse getUser(String id);
    UserResponse getUserByUsername(String username);
    UserResponse updateUser(String id, UserUpdateRequest request);
    void deleteUser(String id);
    Page<UserResponse> searchUsersByUsername(String username, Pageable pageable);
}

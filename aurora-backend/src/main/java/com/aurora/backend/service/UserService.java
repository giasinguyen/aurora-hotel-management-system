package com.aurora.backend.service;


import java.util.HashSet;
import java.util.List;

import com.aurora.backend.dto.request.UserCreationRequest;
import com.aurora.backend.dto.request.UserRegistrationRequest;
import com.aurora.backend.dto.request.UserUpdateRequest;
import com.aurora.backend.dto.response.UserResponse;
import com.aurora.backend.entity.Role;
import com.aurora.backend.entity.User;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.UserMapper;
import com.aurora.backend.repository.RoleRepository;
import com.aurora.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public UserResponse registerUser(UserRegistrationRequest request) {
        log.info("Registering new user with username: {}", request.getUsername());
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dob(request.getDob())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .build();

        // Gán role CUSTOMER cho user mới đăng ký (không phải USER)
        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> {
                    log.error("CUSTOMER role not found in database! Please run init-roles-permissions.sql");
                    return new AppException(ErrorCode.ROLE_NOT_EXISTED);
                });

        user.setRoles(new HashSet<>());
        user.getRoles().add(customerRole);

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {} and role: CUSTOMER", savedUser.getId());
        
        return userMapper.toUserResponse(savedUser);
    }

    public UserResponse createUser(UserCreationRequest request) {
        log.info("Creating user with username: {}", request.getUsername());
        
        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        
        return userMapper.toUserResponse(savedUser);
    }

    public List<UserResponse> getUsers() {
        log.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public Page<UserResponse> getUsersWithPagination(Pageable pageable) {
        log.info("Fetching users with pagination: page {}, size {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findAll(pageable)
                .map(userMapper::toUserResponse);
    }

    public UserResponse getUser(String id) {
        log.info("Fetching user by ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    public UserResponse getUserByUsername(String username) {
        log.info("Fetching user by username: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUser(String id, UserUpdateRequest request) {
        log.info("Updating user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUserFromRequest(request, user);
        User updatedUser = userRepository.save(user);
        
        log.info("User updated successfully with ID: {}", updatedUser.getId());
        return userMapper.toUserResponse(updatedUser);
    }

    public void deleteUser(String id) {
        log.info("Deleting user with ID: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        
        userRepository.deleteById(id);
        log.info("User deleted successfully with ID: {}", id);
    }

    public Page<UserResponse> searchUsersByUsername(String username, Pageable pageable) {
        log.info("Searching users by username: {} with pagination", username);
        return userRepository.findByUsernameContainingIgnoreCase(username, pageable)
                .map(userMapper::toUserResponse);
    }
}
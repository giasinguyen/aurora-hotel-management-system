package com.aurora.backend.service.impl;


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
import com.aurora.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerUser(UserRegistrationRequest request) {
        log.info("Registering new user with username: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        validatePasswordStrength(request.getPassword());

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

    @Override
    public UserResponse createUser(UserCreationRequest request) {
        log.info("Creating user with username: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        validatePasswordStrength(request.getPassword());

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public List<UserResponse> getUsers() {
        log.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Override
    public Page<UserResponse> getUsersWithPagination(Pageable pageable) {
        log.info("Fetching users with pagination: page {}, size {}",
                pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findAll(pageable)
                .map(userMapper::toUserResponse);
    }

    @Override
    public UserResponse getUser(String id) {
        log.info("Fetching user by ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        log.info("Fetching user by username: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        log.info("Updating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUserFromRequest(request, user);
        User updatedUser = userRepository.save(user);

        log.info("User updated successfully with ID: {}", updatedUser.getId());
        return userMapper.toUserResponse(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        log.info("Deleting user with ID: {}", id);

        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        userRepository.deleteById(id);
        log.info("User deleted successfully with ID: {}", id);
    }

    @Override
    public Page<UserResponse> searchUsersByUsername(String username, Pageable pageable) {
        log.info("Searching users by username: {} with pagination", username);
        return userRepository.findByUsernameContainingIgnoreCase(username, pageable)
                .map(userMapper::toUserResponse);
    }

    /**
     * Validates password strength according to security requirements:
     * - At least 8 characters long
     * - Contains at least one uppercase letter (A-Z)
     * - Contains at least one lowercase letter (a-z)
     * - Contains at least one digit (0-9)
     * - Contains at least one special character (!@#$%^&*()_+-=[]{}|;:',.<>?/)
     *
     * @param password The password to validate
     * @throws AppException with ErrorCode.WEAK_PASSWORD if validation fails
     */
    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            log.warn("Password validation failed: too short (minimum 8 characters required)");
            throw new AppException(ErrorCode.WEAK_PASSWORD);
        }

        boolean hasUppercase = false;
        boolean hasLowercase = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        String specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUppercase = true;
            } else if (Character.isLowerCase(c)) {
                hasLowercase = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            } else if (specialChars.indexOf(c) >= 0) {
                hasSpecial = true;
            }
        }

        if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecial) {
            log.warn("Password validation failed: missing required character types (uppercase={}, lowercase={}, digit={}, special={})",
                    hasUppercase, hasLowercase, hasDigit, hasSpecial);
            throw new AppException(ErrorCode.WEAK_PASSWORD);
        }

        log.debug("Password validation passed successfully");
    }
}

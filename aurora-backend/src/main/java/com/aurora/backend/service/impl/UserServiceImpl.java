package com.aurora.backend.service.impl;


import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.aurora.backend.dto.request.ProfileUpdateRequest;
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
import com.aurora.backend.service.CloudinaryService;
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
import org.springframework.web.multipart.MultipartFile;

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
    CloudinaryService cloudinaryService;

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
    @Transactional
    public UserResponse createUser(UserCreationRequest request) {
        log.info("Creating user with username: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        validatePasswordStrength(request.getPassword());

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Set roles if provided
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
                roles.add(role);
            }
            user.setRoles(roles);
            log.info("Assigned roles to user: {}", request.getRoles());
        }

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
    public Page<UserResponse> getUsersByRoleName(String roleName, Pageable pageable) {
        log.info("Fetching users with role: {} - page {}, size {}",
                roleName, pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findAllByRoleNamePaginated(roleName, pageable)
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
    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        log.info("Updating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Update basic fields
        userMapper.updateUserFromRequest(request, user);
        
        // Update roles if provided
        if (request.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
                roles.add(role);
            }
            user.setRoles(roles);
            log.info("Updated roles for user {}: {}", id, request.getRoles());
        }
        
        User updatedUser = userRepository.save(user);

        log.info("User updated successfully with ID: {}", updatedUser.getId());
        return userMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateMyProfile(String id, ProfileUpdateRequest request) {
        log.info("Updating profile for user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Only update basic profile fields (not active, roles, etc.)
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getDob() != null) {
            user.setDob(request.getDob());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        User updatedUser = userRepository.save(user);

        log.info("Profile updated successfully for user ID: {}", updatedUser.getId());
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

    @Override
    @Transactional
    public UserResponse assignRoleToUser(String userId, String roleId) {
        log.info("Assigning role {} to user {}", roleId, userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        
        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }
        
        if (user.getRoles().contains(role)) {
            log.warn("User {} already has role {}", userId, roleId);
            throw new AppException(ErrorCode.ROLE_ALREADY_ASSIGNED);
        }
        
        user.getRoles().add(role);
        User savedUser = userRepository.save(user);
        
        log.info("Successfully assigned role {} to user {}", roleId, userId);
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse removeRoleFromUser(String userId, String roleId) {
        log.info("Removing role {} from user {}", roleId, userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        
        if (user.getRoles() == null || !user.getRoles().contains(role)) {
            log.warn("User {} does not have role {}", userId, roleId);
            throw new AppException(ErrorCode.ROLE_NOT_ASSIGNED);
        }
        
        user.getRoles().remove(role);
        User savedUser = userRepository.save(user);
        
        log.info("Successfully removed role {} from user {}", roleId, userId);
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public List<String> getUserDisabledPermissions(String userId) {
        log.info("Getting disabled permissions for user {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        List<String> disabledPermissions = user.getDisabledPermissions();
        if (disabledPermissions == null) {
            disabledPermissions = new java.util.ArrayList<>();
        }
        
        log.info("User {} has {} disabled permissions", userId, disabledPermissions.size());
        return disabledPermissions;
    }

    @Override
    @Transactional
    public UserResponse updateUserPermissions(String userId, List<String> disabledPermissions) {
        log.info("Updating permissions for user {}: {} disabled permissions", userId, 
                disabledPermissions != null ? disabledPermissions.size() : 0);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        if (disabledPermissions == null) {
            disabledPermissions = new java.util.ArrayList<>();
        }
        
        user.setDisabledPermissions(disabledPermissions);
        User savedUser = userRepository.save(user);
        
        log.info("Successfully updated permissions for user {}", userId);
        return userMapper.toUserResponse(savedUser);
    }
    @Override
    @Transactional
    public UserResponse uploadAvatar(String username, MultipartFile file) {
        log.info("Request to upload avatar for user: {}", username);
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        try {
            // 3. Xử lý xóa ảnh cũ (Nếu đã có)
            String oldAvatarUrl = user.getAvatarUrl();
            if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty()) {
                String publicId = cloudinaryService.extractPublicId(oldAvatarUrl);
                if (publicId != null) {
                    try {
                        cloudinaryService.deleteFile(publicId);
                        log.info("Deleted old avatar with public_id: {}", publicId);
                    } catch (Exception e) {
                        log.warn("Failed to delete old avatar: {}", e.getMessage());
                    }
                }
            }
            // 4. Upload ảnh mới
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, "aurora/avatars");
            // Lấy secure_url từ kết quả trả về
            String newAvatarUrl = (String) uploadResult.get("secure_url");
            // 5. Cập nhật User
            user.setAvatarUrl(newAvatarUrl);
            User savedUser = userRepository.save(user);
            log.info("Avatar updated successfully for user: {}", username);
            return userMapper.toUserResponse(savedUser);
        } catch (IOException e) {
            log.error("Error uploading avatar to Cloudinary", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
}

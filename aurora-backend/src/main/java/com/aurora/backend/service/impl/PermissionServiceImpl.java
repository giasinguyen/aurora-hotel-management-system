package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.PermissionCreationRequest;
import com.aurora.backend.dto.request.PermissionUpdateRequest;
import com.aurora.backend.dto.response.PermissionResponse;
import com.aurora.backend.entity.Permission;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.PermissionMapper;
import com.aurora.backend.repository.PermissionRepository;
import com.aurora.backend.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionServiceImpl implements PermissionService {
    
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @Override
    @Transactional
    public PermissionResponse createPermission(PermissionCreationRequest request) {
        log.info("Creating permission: {}", request.getCode());
        
        // Check if permission code already exists
        if (permissionRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.PERMISSION_EXISTED);
        }
        
        Permission permission = permissionMapper.toPermission(request);
        Permission savedPermission = permissionRepository.save(permission);
        log.info("Permission created successfully with ID: {}", savedPermission.getId());
        
        return permissionMapper.toPermissionResponse(savedPermission);
    }

    @Override
    @Transactional
    public PermissionResponse updatePermission(String id, PermissionUpdateRequest request) {
        log.info("Updating permission with ID: {}", id);
        
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        
        permissionMapper.updatePermission(permission, request);
        Permission updatedPermission = permissionRepository.save(permission);
        log.info("Permission updated successfully with ID: {}", updatedPermission.getId());
        
        return permissionMapper.toPermissionResponse(updatedPermission);
    }

    @Override
    @Transactional
    public void deletePermission(String id) {
        log.info("Deleting permission with ID: {}", id);
        
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        
        permissionRepository.delete(permission);
        log.info("Permission deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionResponse getPermissionById(String id) {
        log.debug("Fetching permission with ID: {}", id);
        
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        
        return permissionMapper.toPermissionResponse(permission);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PermissionResponse> getAllPermissions(Pageable pageable) {
        log.debug("Fetching all permissions with pagination: {}", pageable);
        
        Page<Permission> permissions = permissionRepository.findAll(pageable);
        return permissions.map(permissionMapper::toPermissionResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PermissionResponse> searchPermissions(String code, String description, Pageable pageable) {
        log.debug("Searching permissions with filters - Code: {}, Description: {}", code, description);
        
        Page<Permission> permissions = permissionRepository.findByFilters(code, description, pageable);
        return permissions.map(permissionMapper::toPermissionResponse);
    }
}

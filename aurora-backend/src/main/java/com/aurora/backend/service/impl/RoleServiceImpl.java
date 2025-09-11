package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.RoleCreationRequest;
import com.aurora.backend.dto.request.RoleUpdateRequest;
import com.aurora.backend.dto.response.RoleResponse;
import com.aurora.backend.entity.Permission;
import com.aurora.backend.entity.Role;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.RoleMapper;
import com.aurora.backend.repository.PermissionRepository;
import com.aurora.backend.repository.RoleRepository;
import com.aurora.backend.service.RoleService;
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
public class RoleServiceImpl implements RoleService {
    
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    @Override
    @Transactional
    public RoleResponse createRole(RoleCreationRequest request) {
        log.info("Creating role: {}", request.getName());
        
        // Check if role name already exists
        if (roleRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.ROLE_EXISTED);
        }
        
        Role role = roleMapper.toRole(request);
        Role savedRole = roleRepository.save(role);
        log.info("Role created successfully with ID: {}", savedRole.getId());
        
        return roleMapper.toRoleResponse(savedRole);
    }

    @Override
    @Transactional
    public RoleResponse updateRole(String id, RoleUpdateRequest request) {
        log.info("Updating role with ID: {}", id);
        
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        
        roleMapper.updateRole(role, request);
        Role updatedRole = roleRepository.save(role);
        log.info("Role updated successfully with ID: {}", updatedRole.getId());
        
        return roleMapper.toRoleResponse(updatedRole);
    }

    @Override
    @Transactional
    public void deleteRole(String id) {
        log.info("Deleting role with ID: {}", id);
        
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        
        roleRepository.delete(role);
        log.info("Role deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(String id) {
        log.debug("Fetching role with ID: {}", id);
        
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        
        return roleMapper.toRoleResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoleResponse> getAllRoles(Pageable pageable) {
        log.debug("Fetching all roles with pagination: {}", pageable);
        
        Page<Role> roles = roleRepository.findAll(pageable);
        return roles.map(roleMapper::toRoleResponse);
    }

    @Override
    @Transactional
    public RoleResponse addPermissionToRole(String roleId, String permissionId) {
        log.info("Adding permission {} to role {}", permissionId, roleId);
        
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        
        role.getPermissions().add(permission);
        Role updatedRole = roleRepository.save(role);
        
        return roleMapper.toRoleResponse(updatedRole);
    }

    @Override
    @Transactional
    public RoleResponse removePermissionFromRole(String roleId, String permissionId) {
        log.info("Removing permission {} from role {}", permissionId, roleId);
        
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        
        role.getPermissions().remove(permission);
        Role updatedRole = roleRepository.save(role);
        
        return roleMapper.toRoleResponse(updatedRole);
    }
}

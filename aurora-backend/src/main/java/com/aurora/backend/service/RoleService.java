package com.aurora.backend.service;

import com.aurora.backend.dto.request.RoleCreationRequest;
import com.aurora.backend.dto.request.RoleUpdateRequest;
import com.aurora.backend.dto.response.RoleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoleService {
    RoleResponse createRole(RoleCreationRequest request);
    RoleResponse updateRole(String id, RoleUpdateRequest request);
    void deleteRole(String id);
    RoleResponse getRoleById(String id);
    Page<RoleResponse> getAllRoles(Pageable pageable);
    RoleResponse addPermissionToRole(String roleId, String permissionId);
    RoleResponse removePermissionFromRole(String roleId, String permissionId);
}

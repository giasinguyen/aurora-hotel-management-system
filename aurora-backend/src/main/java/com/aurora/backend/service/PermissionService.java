package com.aurora.backend.service;

import com.aurora.backend.dto.request.PermissionCreationRequest;
import com.aurora.backend.dto.request.PermissionUpdateRequest;
import com.aurora.backend.dto.response.PermissionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PermissionService {
    PermissionResponse createPermission(PermissionCreationRequest request);
    PermissionResponse updatePermission(String id, PermissionUpdateRequest request);
    void deletePermission(String id);
    PermissionResponse getPermissionById(String id);
    Page<PermissionResponse> getAllPermissions(Pageable pageable);
    Page<PermissionResponse> searchPermissions(String name, String description, Pageable pageable);
}

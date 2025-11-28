package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.PermissionCreationRequest;
import com.aurora.backend.dto.request.PermissionUpdateRequest;
import com.aurora.backend.dto.response.PermissionResponse;
import com.aurora.backend.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    Permission toPermission(PermissionCreationRequest request);
    
    PermissionResponse toPermissionResponse(Permission permission);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updatePermission(@MappingTarget Permission permission, PermissionUpdateRequest request);
}

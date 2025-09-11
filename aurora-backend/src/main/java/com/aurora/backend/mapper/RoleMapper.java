package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.RoleCreationRequest;
import com.aurora.backend.dto.request.RoleUpdateRequest;
import com.aurora.backend.dto.response.RoleResponse;
import com.aurora.backend.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleCreationRequest request);
    
    RoleResponse toRoleResponse(Role role);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    void updateRole(@MappingTarget Role role, RoleUpdateRequest request);
}

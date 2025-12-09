package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.UserCreationRequest;
import com.aurora.backend.dto.request.UserUpdateRequest;
import com.aurora.backend.dto.response.PermissionResponse;
import com.aurora.backend.dto.response.RoleResponse;
import com.aurora.backend.dto.response.UserResponse;
import com.aurora.backend.entity.Permission;
import com.aurora.backend.entity.Role;
import com.aurora.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "address", source = "address")
    User toUser(UserCreationRequest request);

    @Mapping(target = "roles", source = "roles", qualifiedByName = "rolesToRoleResponses")
    @Mapping(target = "assignedBranchId", source = "assignedBranch.id")
    @Mapping(target = "assignedBranchName", source = "assignedBranch.name")
    UserResponse toUserResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);
    
    @Named("rolesToRoleResponses")
    default Set<RoleResponse> rolesToRoleResponses(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(role -> RoleResponse.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .description(role.getDescription())
                        .permissions(permissionsToPermissionResponses(role.getPermissions()))
                        .build())
                .collect(Collectors.toSet());
    }
    
    default Set<PermissionResponse> permissionsToPermissionResponses(Set<Permission> permissions) {
        if (permissions == null) {
            return null;
        }
        return permissions.stream()
                .map(permission -> PermissionResponse.builder()
                        .id(permission.getId())
                        .name(permission.getName())
                        .description(permission.getDescription())
                        .build())
                .collect(Collectors.toSet());
    }
}

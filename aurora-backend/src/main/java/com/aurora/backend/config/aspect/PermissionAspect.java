package com.aurora.backend.config.aspect;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Aspect
@Component
@Slf4j
public class PermissionAspect {

    @Before("@annotation(requirePermission)")
    public void checkPermission(RequirePermission requirePermission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        Set<String> userPermissions = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String[] requiredPermissions = requirePermission.value();
        RequirePermission.LogicType logic = requirePermission.logic();

        boolean hasPermission = switch (logic) {
            case AND -> hasAllPermissions(userPermissions, requiredPermissions);
            case OR -> hasAnyPermission(userPermissions, requiredPermissions);
        };

        if (!hasPermission) {
            log.warn("User {} không có quyền: {}", 
                    authentication.getName(), 
                    String.join(", ", requiredPermissions));
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    private boolean hasAllPermissions(Set<String> userPermissions, String[] requiredPermissions) {
        for (String permission : requiredPermissions) {
            if (!userPermissions.contains(permission)) {
                return false;
            }
        }
        return true;
    }

    private boolean hasAnyPermission(Set<String> userPermissions, String[] requiredPermissions) {
        for (String permission : requiredPermissions) {
            if (userPermissions.contains(permission)) {
                return true;
            }
        }
        return false;
    }
}

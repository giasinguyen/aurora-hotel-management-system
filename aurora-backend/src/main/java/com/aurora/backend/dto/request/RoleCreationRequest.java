package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleCreationRequest {
    @NotBlank(message = "ROLE_NAME_REQUIRED")
    String name;
    
    String description;
    
    Set<String> permissionIds;
}

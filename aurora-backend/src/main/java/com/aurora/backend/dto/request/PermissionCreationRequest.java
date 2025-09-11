package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionCreationRequest {
    @NotBlank(message = "PERMISSION_CODE_REQUIRED")
    String code;
    
    String description;
}

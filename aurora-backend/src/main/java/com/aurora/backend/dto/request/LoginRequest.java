package com.aurora.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for user login with session metadata
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginRequest {
    
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @Valid
    @NotNull(message = "Session metadata is required")
    private SessionMetaRequest sessionMeta;
}


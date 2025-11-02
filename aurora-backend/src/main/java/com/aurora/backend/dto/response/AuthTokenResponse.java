package com.aurora.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for authentication with access token
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonPropertyOrder({"user", "accessToken"})
public class AuthTokenResponse {
    @JsonProperty("user")
    private UserSessionResponse userSessionResponse;
    
    private String accessToken;
}


package com.aurora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseCookie;

/**
 * Internal DTO wrapping authentication response and cookie
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResult {
    private AuthTokenResponse authTokenResponse;
    private ResponseCookie responseCookie;
}


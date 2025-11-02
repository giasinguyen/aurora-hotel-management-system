package com.aurora.backend.controller;

import com.aurora.backend.dto.request.LoginRequest;
import com.aurora.backend.dto.request.RegisterRequest;
import com.aurora.backend.dto.request.SessionMetaRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.AuthResult;
import com.aurora.backend.dto.response.AuthTokenResponse;
import com.aurora.backend.dto.response.SessionMetaResponse;
import com.aurora.backend.dto.response.UserDetailsResponse;
import com.aurora.backend.dto.response.UserSessionResponse;
import com.aurora.backend.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {
    
    private final AuthenticationService authenticationService;

    /**
     * Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSessionResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        log.info("Registration request for user: {}", request.getUsername());
        return ResponseEntity.ok(ApiResponse.<UserSessionResponse>builder()
                .message("User registered successfully")
                .result(authenticationService.handleRegister(request))
                .build());
    }

    /**
     * Login with session metadata (device info)
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        log.info("Login request for user: {}", request.getUsername());
        
        AuthResult authResult = authenticationService.handleLogin(request);

        AuthTokenResponse authTokenResponse = authResult.getAuthTokenResponse();
        ResponseCookie responseCookie = authResult.getResponseCookie();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(ApiResponse.<AuthTokenResponse>builder()
                        .message("Login successful")
                        .result(authTokenResponse)
                        .build());
    }

    /**
     * Logout and clear refresh token cookie
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(value = "refresh_token", required = false) String refreshToken
    ) {
        log.info("Logout request");
        ResponseCookie responseCookie = authenticationService.handleLogout(refreshToken);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Logout successful")
                .result(null)
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(response);
    }

    /**
     * Get current user session information
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSessionResponse>> getCurrentUser() {
        log.info("Get current user request");
        return ResponseEntity.ok(ApiResponse.<UserSessionResponse>builder()
                .message("Current user retrieved successfully")
                .result(authenticationService.getCurrentUser())
                .build());
    }

    /**
     * Get current user detailed information
     */
    @GetMapping("/me/details")
    public ResponseEntity<ApiResponse<UserDetailsResponse>> getCurrentUserDetails() {
        log.info("Get current user details request");
        return ResponseEntity.ok(ApiResponse.<UserDetailsResponse>builder()
                .message("User details retrieved successfully")
                .result(authenticationService.getCurrentUserDetails())
                .build());
    }

    /**
     * Refresh access token using refresh token from cookie
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> refreshToken(
            @CookieValue(value = "refresh_token") String refreshToken,
            @RequestBody SessionMetaRequest sessionMetaRequest
    ) throws ParseException, JOSEException {
        log.info("Refresh token request");
        
        AuthResult authResult = authenticationService.handleRefresh(refreshToken, sessionMetaRequest);

        AuthTokenResponse authTokenResponse = authResult.getAuthTokenResponse();
        ResponseCookie responseCookie = authResult.getResponseCookie();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(ApiResponse.<AuthTokenResponse>builder()
                        .message("Token refreshed successfully")
                        .result(authTokenResponse)
                        .build());
    }

    /**
     * Get all sessions for current user
     */
    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<SessionMetaResponse>>> getAllSessions(
            @CookieValue(value = "refresh_token") String refreshToken
    ) throws ParseException, JOSEException {
        log.info("Get all sessions request");
        return ResponseEntity.ok(ApiResponse.<List<SessionMetaResponse>>builder()
                .message("Sessions retrieved successfully")
                .result(authenticationService.getAllSelfSessionMetas(refreshToken))
                .build());
    }

    /**
     * Remove a specific session
     */
    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> removeSession(@PathVariable String sessionId) {
        log.info("Remove session request: {}", sessionId);
        authenticationService.removeSelfSession(sessionId);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Session removed successfully")
                .result(null)
                .build();
        
        return ResponseEntity.ok(response);
    }
}

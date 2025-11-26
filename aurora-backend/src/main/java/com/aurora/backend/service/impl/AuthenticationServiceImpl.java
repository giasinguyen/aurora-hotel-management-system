package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.*;
import com.aurora.backend.dto.response.AuthResult;
import com.aurora.backend.dto.response.AuthTokenResponse;
import com.aurora.backend.dto.response.SessionMetaResponse;
import com.aurora.backend.dto.response.UserDetailsResponse;
import com.aurora.backend.dto.response.UserSessionResponse;
import com.aurora.backend.entity.EmailVerificationToken;
import com.aurora.backend.entity.PasswordResetToken;
import com.aurora.backend.entity.Permission;
import com.aurora.backend.entity.Role;
import com.aurora.backend.entity.User;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.repository.EmailVerificationTokenRepository;
import com.aurora.backend.repository.PasswordResetTokenRepository;
import com.aurora.backend.repository.RoleRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.service.AuthenticationService;
import com.aurora.backend.service.RefreshTokenRedisService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    
    UserRepository userRepository;
    RoleRepository roleRepository;
    RefreshTokenRedisService refreshTokenRedisService;
    PasswordEncoder passwordEncoder;
    PasswordResetTokenRepository passwordResetTokenRepository;
    EmailVerificationTokenRepository emailVerificationTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long ACCESS_TOKEN_EXPIRATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESH_TOKEN_EXPIRATION;

    @Override
    @Transactional
    public UserSessionResponse handleRegister(RegisterRequest request) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DataIntegrityViolationException("Username already exists");
        }
        
        userRepository.findByUsername(request.getEmail()).ifPresent(u -> {
            throw new DataIntegrityViolationException("Email already exists");
        });

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dob(request.getDob())
                .phone(request.getPhone())
                .address(request.getAddress())
                .active(true)
                .failedLoginAttempts(0)
                .build();

        // Assign default CUSTOMER role
        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        user.setRoles(Set.of(customerRole));

        User savedUser = userRepository.saveAndFlush(user);
        log.info("New user registered: {}", savedUser.getUsername());

        return mapToUserSessionResponse(savedUser);
    }

    @Override
    @Transactional
    public AuthResult handleLogin(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            log.warn("Login attempt on locked account: {}", user.getUsername());
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            handleFailedLogin(user);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        handleSuccessfulLogin(user);

        return buildAuthResult(user, request.getSessionMeta());
    }

    @Override
    public ResponseCookie handleLogout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            try {
                SignedJWT signedJWT = SignedJWT.parse(refreshToken);
                String username = signedJWT.getJWTClaimsSet().getSubject();

                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

                refreshTokenRedisService.deleteRefreshToken(refreshToken, user.getId());
            } catch (ParseException e) {
                log.error("Error parsing refresh token during logout", e);
            }
        }

        return ResponseCookie
                .from("refresh_token", "")
                .httpOnly(true)
                .path("/")
                .sameSite("Strict")
                .maxAge(0)
                .build();
    }

    @Override
    public UserDetailsResponse getCurrentUserDetails() {
        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return UserDetailsResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dob(user.getDob())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public AuthResult handleRefresh(String refreshToken, SessionMetaRequest sessionMetaRequest) 
            throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(refreshToken);
        String username = signedJWT.getJWTClaimsSet().getSubject();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        String userId = user.getId();

        // Validate token exists in Redis
        if (!refreshTokenRedisService.validateToken(refreshToken, userId)) {
            throw new BadJwtException("Invalid refresh token");
        }

        // Delete old refresh token
        refreshTokenRedisService.deleteRefreshToken(refreshToken, userId);

        // Generate new tokens
        return buildAuthResult(user, sessionMetaRequest);
    }

    @Override
    public void removeSelfSession(String sessionId) {
        // Extract userId from sessionId format: auth::refresh_token:{userId}:{hash}
        // Example: auth::refresh_token:56d23fa3-2050-4c32-bfc2-59a1d50e7133:ea8872bbfd96...
        log.info("Attempting to remove session: {}", sessionId);
        
        // Check if session exists in Redis
        if (!refreshTokenRedisService.sessionExists(sessionId)) {
            log.error("Session not found or already expired: {}", sessionId);
            throw new AppException(ErrorCode.SESSION_NOT_FOUND);
        }
        
        String[] parts = sessionId.split(":");
        log.info("SessionId split into {} parts", parts.length);
        
        if (parts.length < 5) {
            log.error("Invalid sessionId format. Expected at least 5 parts, got {}", parts.length);
            throw new AppException(ErrorCode.INVALID_KEY);
        }
        
        // parts[0] = "auth", parts[1] = "", parts[2] = "refresh_token", parts[3] = userId, parts[4] = hash
        String sessionUserId = parts[3];
        log.info("SessionId belongs to userId: {}", sessionUserId);

        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        log.info("Current authenticated user: {}", currentUsername);
        
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        log.info("Current user ID: {}, Session user ID: {}", user.getId(), sessionUserId);

        if (!user.getId().equals(sessionUserId)) {
            log.error("Permission denied: User {} (ID: {}) tried to remove session of user ID: {}", 
                    currentUsername, user.getId(), sessionUserId);
            throw new AccessDeniedException("You can only remove your own sessions");
        }

        refreshTokenRedisService.deleteRefreshToken(sessionId);
        log.info("Session removed successfully: {}", sessionId);
    }

    @Override
    public List<SessionMetaResponse> getAllSelfSessionMetas(String refreshToken) 
            throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(refreshToken);
        String username = signedJWT.getJWTClaimsSet().getSubject();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        String userId = user.getId();

        return refreshTokenRedisService.getAllSessionMetas(userId, refreshToken);
    }

    @Override
    public UserSessionResponse getCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return mapToUserSessionResponse(user);
    }

    // ========================================================================
    // PRIVATE HELPER METHODS
    // ========================================================================

    private void handleFailedLogin(User user) {
        Integer failedAttempts = user.getFailedLoginAttempts() != null
                ? user.getFailedLoginAttempts() : 0;
        failedAttempts++;

        user.setFailedLoginAttempts(failedAttempts);

        if (failedAttempts >= 5) {
            user.setLockedUntil(LocalDateTime.now().plusHours(24));
            user.setLockReason("Too many failed login attempts");
            log.warn("Account locked due to failed attempts: {}", user.getUsername());
        }

        userRepository.save(user);
        log.info("Failed login attempt {} for user: {}", failedAttempts, user.getUsername());
    }

    private void handleSuccessfulLogin(User user) {
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLockReason(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("Successful login for user: {}", user.getUsername());
    }

    private AuthResult buildAuthResult(User user, SessionMetaRequest sessionMetaRequest) {
        // Generate refresh token
        String refreshToken = buildJwt(REFRESH_TOKEN_EXPIRATION, user);
        refreshTokenRedisService.saveRefreshToken(
                refreshToken,
                user.getId(),
                sessionMetaRequest,
                Duration.ofSeconds(REFRESH_TOKEN_EXPIRATION)
        );

        ResponseCookie responseCookie = ResponseCookie
                .from("refresh_token", refreshToken)
                .httpOnly(true)
                .path("/")
                .sameSite("Strict")
                .maxAge(REFRESH_TOKEN_EXPIRATION)
                .build();

        // Generate access token
        String accessToken = buildJwt(ACCESS_TOKEN_EXPIRATION, user);

        AuthTokenResponse authTokenResponse = new AuthTokenResponse(
                mapToUserSessionResponse(user),
                accessToken
        );

        return new AuthResult(authTokenResponse, responseCookie);
    }

    private String buildJwt(Long expirationRate, User user) {
        Instant now = Instant.now();
        Instant validity = now.plus(expirationRate, ChronoUnit.SECONDS);

        // Header
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        // Payload - Only essential claims to reduce token size
        List<String> roleNames = user.getRoles() != null 
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                : Collections.emptyList();
        
        List<String> permissions = new ArrayList<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                if (role.getPermissions() != null) {
                    permissions.addAll(
                            role.getPermissions().stream()
                                    .map(Permission::getName)
                                    .collect(Collectors.toList())
                    );
                }
            });
        }

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issueTime(Date.from(now))
                .expirationTime(Date.from(validity))
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("roles", roleNames)
                .claim("permissions", permissions)
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(claims.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create JWT", e);
            throw new RuntimeException(e);
        }
    }

    private UserSessionResponse mapToUserSessionResponse(User user) {
        List<String> roleNames = user.getRoles() != null 
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                : Collections.emptyList();

        List<String> permissions = new ArrayList<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                if (role.getPermissions() != null) {
                    permissions.addAll(
                            role.getPermissions().stream()
                                    .map(Permission::getName)
                                    .collect(Collectors.toList())
                    );
                }
            });
        }

        return UserSessionResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .roles(roleNames)
                .permissions(permissions)
                .branchId(user.getAssignedBranch() != null ? user.getAssignedBranch().getId() : null)
                .branchName(user.getAssignedBranch() != null ? user.getAssignedBranch().getName() : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
                .build();
    }

    
    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        passwordResetTokenRepository.invalidateAllUserTokens(user);
        
        // Create new reset token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .used(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        passwordResetTokenRepository.save(resetToken);
        
        log.info("Password reset token generated for user: {}. Token: {}", user.getEmail(), token);
    }
    
    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }
        
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));
        
        if (!resetToken.isValid()) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }
        
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLockReason(null);
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setUsed(true);
        resetToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);
        
        log.info("Password reset successful for user: {}", user.getEmail());
    }
    
    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        // Get current authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        // Validate current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }
        
        // Validate new passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        log.info("Password changed successfully for user: {}", user.getUsername());
    }
    
    @Override
    @Transactional
    public void sendVerificationEmail(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        if (user.getEmailVerified()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        
        emailVerificationTokenRepository.invalidateAllUserTokens(user);
        
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(48))
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        emailVerificationTokenRepository.save(verificationToken);
        
        log.info("Verification email sent to: {}. Token: {}", user.getEmail(), token);
    }
    
    @Override
    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));
        
        if (!verificationToken.isValid()) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }
        
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        
        verificationToken.setVerified(true);
        verificationToken.setVerifiedAt(LocalDateTime.now());
        emailVerificationTokenRepository.save(verificationToken);
        
        log.info("Email verified successfully for user: {}", user.getEmail());
    }
    
    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        if (user.getEmailVerified()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        
        sendVerificationEmail(user.getId());
    }
}

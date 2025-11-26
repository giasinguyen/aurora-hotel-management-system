package com.aurora.backend.service;

import com.aurora.backend.dto.request.*;
import com.aurora.backend.dto.response.AuthResult;
import com.aurora.backend.dto.response.SessionMetaResponse;
import com.aurora.backend.dto.response.UserDetailsResponse;
import com.aurora.backend.dto.response.UserSessionResponse;
import com.nimbusds.jose.JOSEException;
import org.springframework.http.ResponseCookie;

import java.text.ParseException;
import java.util.List;

public interface AuthenticationService {
    
    UserSessionResponse handleRegister(RegisterRequest request);
    
    AuthResult handleLogin(LoginRequest request);
    
    ResponseCookie handleLogout(String refreshToken);
    
    UserDetailsResponse getCurrentUserDetails();
    
    AuthResult handleRefresh(String refreshToken, SessionMetaRequest sessionMetaRequest) throws ParseException, JOSEException;
    
    void removeSelfSession(String sessionId);
    
    List<SessionMetaResponse> getAllSelfSessionMetas(String refreshToken) throws ParseException, JOSEException;
    
    UserSessionResponse getCurrentUser();
    
    void forgotPassword(ForgotPasswordRequest request);
    
    void resetPassword(ResetPasswordRequest request);
    
    void changePassword(ChangePasswordRequest request);
    
    void sendVerificationEmail(String userId);
    
    void verifyEmail(VerifyEmailRequest request);
    
    void resendVerificationEmail(String email);
}


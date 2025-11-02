package com.aurora.backend.service;

import com.aurora.backend.dto.request.LoginRequest;
import com.aurora.backend.dto.request.RegisterRequest;
import com.aurora.backend.dto.request.SessionMetaRequest;
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
}

package com.aurora.backend.service;

import com.aurora.backend.dto.request.AuthenticationRequest;
import com.aurora.backend.dto.request.IntrospectRequest;
import com.aurora.backend.dto.request.LogoutRequest;
import com.aurora.backend.dto.request.RefreshRequest;
import com.aurora.backend.dto.response.AuthenticationResponse;
import com.aurora.backend.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    AuthenticationResponse authenticate(AuthenticationRequest request);
    AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
    void logout(LogoutRequest request) throws ParseException, JOSEException;
}

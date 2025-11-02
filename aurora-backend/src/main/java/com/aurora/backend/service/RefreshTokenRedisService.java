package com.aurora.backend.service;

import com.aurora.backend.dto.request.SessionMetaRequest;
import com.aurora.backend.dto.response.SessionMetaResponse;

import java.time.Duration;
import java.util.List;

/**
 * Service for managing refresh tokens in Redis
 */
public interface RefreshTokenRedisService {
    
    /**
     * Save refresh token with session metadata
     */
    void saveRefreshToken(String token, String userId, SessionMetaRequest sessionMetaRequest, Duration expire);

    /**
     * Validate if refresh token exists for user
     */
    boolean validateToken(String token, String userId);

    /**
     * Delete refresh token by token and userId
     */
    void deleteRefreshToken(String token, String userId);

    /**
     * Delete refresh token by key directly
     */
    void deleteRefreshToken(String key);

    /**
     * Check if session exists by sessionId (key)
     */
    boolean sessionExists(String sessionId);

    /**
     * Get all session metadata for a user
     */
    List<SessionMetaResponse> getAllSessionMetas(String userId, String currentRefreshToken);
}


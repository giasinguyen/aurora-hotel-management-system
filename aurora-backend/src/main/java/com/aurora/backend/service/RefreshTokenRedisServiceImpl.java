package com.aurora.backend.service;

import com.aurora.backend.dto.request.SessionMetaRequest;
import com.aurora.backend.dto.response.SessionMetaResponse;
import com.aurora.backend.entity.SessionMeta;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * Implementation of RefreshTokenRedisService
 * Manages refresh tokens and session metadata in Redis
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenRedisServiceImpl implements RefreshTokenRedisService {

    private final RedisTemplate<String, SessionMeta> redisSessionMetaTemplate;

    /**
     * Build Redis key for refresh token
     * Format: auth::refresh_token:{userId}:{sha256(token)}
     */
    private String buildKey(String token, String userId) {
        return "auth::refresh_token:" + userId + ":" + DigestUtils.sha256Hex(token);
    }

    @Override
    public void saveRefreshToken(
            String token, 
            String userId,
            SessionMetaRequest sessionMetaRequest, 
            Duration expire
    ) {
        String sessionId = buildKey(token, userId);

        SessionMeta sessionMeta = new SessionMeta(
                sessionId,
                sessionMetaRequest.getDeviceName(),
                sessionMetaRequest.getDeviceType(),
                sessionMetaRequest.getUserAgent(),
                Instant.now()
        );

        redisSessionMetaTemplate.opsForValue().set(sessionId, sessionMeta, expire);
    }

    @Override
    public boolean validateToken(String token, String userId) {
        Boolean hasKey = redisSessionMetaTemplate.hasKey(buildKey(token, userId));
        return hasKey != null && hasKey;
    }

    @Override
    public void deleteRefreshToken(String token, String userId) {
        redisSessionMetaTemplate.delete(buildKey(token, userId));
    }

    @Override
    public void deleteRefreshToken(String key) {
        redisSessionMetaTemplate.delete(key);
    }

    @Override
    public boolean sessionExists(String sessionId) {
        Boolean hasKey = redisSessionMetaTemplate.hasKey(sessionId);
        return hasKey != null && hasKey;
    }

    @Override
    public List<SessionMetaResponse> getAllSessionMetas(String userId, String currentRefreshToken) {
        String keyPattern = "auth::refresh_token:" + userId + ":*";
        Set<String> keys = redisSessionMetaTemplate.keys(keyPattern);

        if (keys == null || keys.isEmpty()) {
            return Collections.emptyList();
        }
        
        String currentTokenHash = DigestUtils.sha256Hex(currentRefreshToken);

        List<SessionMetaResponse> sessionMetas = new ArrayList<>();
        for (String key : keys) {
            SessionMeta meta = redisSessionMetaTemplate.opsForValue().get(key);
            if (meta == null) continue;

            // Extract hash from key to compare with current token
            String keyHash = key.substring(key.lastIndexOf(":") + 1);
            boolean isCurrent = currentTokenHash.equals(keyHash);

            SessionMetaResponse sessionMetaResponse = new SessionMetaResponse(
                    meta.getSessionId(),
                    meta.getDeviceName(),
                    meta.getDeviceType(),
                    meta.getUserAgent(),
                    meta.getLoginAt(),
                    isCurrent
            );
            sessionMetas.add(sessionMetaResponse);
        }
        
        // Sort by login time, most recent first
        sessionMetas.sort((a, b) -> b.getLoginAt().compareTo(a.getLoginAt()));
        
        return sessionMetas;
    }
}


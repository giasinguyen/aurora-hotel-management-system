package com.aurora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Response DTO containing session metadata
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SessionMetaResponse {
    private String sessionId;
    private String deviceName;
    private String deviceType;
    private String userAgent;
    private Instant loginAt;
    private boolean current;
}


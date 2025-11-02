package com.aurora.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * Session metadata stored in Redis
 * Contains information about user's login session and device
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SessionMeta implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String sessionId;
    private String deviceName;
    private String deviceType;
    private String userAgent;
    private Instant loginAt;
}


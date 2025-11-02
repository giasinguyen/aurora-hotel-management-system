package com.aurora.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Session metadata from client device
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SessionMetaRequest {
    private String deviceName;
    private String deviceType;
    private String userAgent;
}


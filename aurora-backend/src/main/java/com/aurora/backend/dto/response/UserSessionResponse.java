package com.aurora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * User session information returned during authentication
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserSessionResponse {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private List<String> roles;
    private List<String> permissions;
    private String branchId;
    private String branchName;
    private String updatedAt;
}


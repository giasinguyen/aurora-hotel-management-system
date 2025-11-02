package com.aurora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Detailed user information response
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserDetailsResponse {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String phone;
    private String address;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String firstName;
    String lastName;
    LocalDate dob;
    String phone;
    String email;
    String address;
    String avatarUrl;
    Boolean active;
    String assignedBranchId;
    String assignedBranchName;
    Set<RoleResponse> roles;
    List<String> disabledPermissions;
}
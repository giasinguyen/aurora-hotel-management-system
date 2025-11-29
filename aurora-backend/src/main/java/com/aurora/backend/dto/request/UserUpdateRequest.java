package com.aurora.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String firstName;
    String lastName;
    LocalDate dob;
    String phone;
    String email;
    String address;
    Boolean active;
    Set<String> roles; // Role names to assign to user
}

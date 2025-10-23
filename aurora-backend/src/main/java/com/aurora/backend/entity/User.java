package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_username", columnList = "username"),
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_phone", columnList = "phone")
})
public class User extends BaseEntity {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(nullable = false, unique = true, length = 50)
    String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(nullable = false)
    String password; // Should be hashed in service layer

    String firstName;
    String lastName;
    LocalDate dob;
    
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    @Column(length = 15)
    String phone;
    
    @Email(message = "Invalid email format")
    @Column(unique = true, length = 100)
    String email;
    
    @Column(length = 500)
    String address;
    
    @Column(length = 500)
    String avatarUrl; // Avatar của user (customer, staff, manager, admin)

    // Branch assignment (for staff and manager ONLY)
    // Customers và Guests sẽ có giá trị NULL
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_branch_id")
    Branch assignedBranch; // Chi nhánh mà user này được phân công (chỉ cho staff/manager)

    // Changed from EAGER to LAZY to prevent N+1 query problem
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<Role> roles;

    // Account status
    @Column(nullable = false)
    @Builder.Default
    Boolean active = true;

    // Security tracking
    LocalDateTime lastLoginAt;
    
    @Column(nullable = false)
    @Builder.Default
    Integer failedLoginAttempts = 0;
    
    LocalDateTime lockedUntil;
    
    @Column(length = 500)
    String lockReason;
}

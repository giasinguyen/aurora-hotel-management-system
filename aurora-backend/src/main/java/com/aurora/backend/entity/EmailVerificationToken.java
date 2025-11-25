package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Entity để lưu trữ email verification tokens
 * Token sẽ expire sau 48 giờ
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "email_verification_tokens", indexes = {
        @Index(name = "idx_verification_token", columnList = "token"),
        @Index(name = "idx_verification_user_id", columnList = "user_id")
})
public class EmailVerificationToken extends BaseEntity {
    
    @Column(nullable = false, unique = true, length = 100)
    String token; // UUID-based token
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;
    
    @Column(nullable = false)
    LocalDateTime expiryDate;
    
    @Column(nullable = false)
    @Builder.Default
    Boolean verified = false;
    
    @Column(nullable = false)
    LocalDateTime createdAt;
    
    LocalDateTime verifiedAt;
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
    
    public boolean isValid() {
        return !this.verified && !this.isExpired();
    }
}

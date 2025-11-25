package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Entity để lưu trữ password reset tokens
 * Token sẽ expire sau 24 giờ
 * Mỗi user chỉ có thể có 1 token active tại một thời điểm
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "password_reset_tokens", indexes = {
        @Index(name = "idx_reset_token", columnList = "token"),
        @Index(name = "idx_reset_user_id", columnList = "user_id")
})
public class PasswordResetToken extends BaseEntity {
    
    @Column(nullable = false, unique = true, length = 100)
    String token; // UUID-based token
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;
    
    @Column(nullable = false)
    LocalDateTime expiryDate;
    
    @Column(nullable = false)
    @Builder.Default
    Boolean used = false;
    
    @Column(nullable = false)
    LocalDateTime createdAt;
    
    LocalDateTime usedAt;
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
    
    public boolean isValid() {
        return !this.used && !this.isExpired();
    }
}

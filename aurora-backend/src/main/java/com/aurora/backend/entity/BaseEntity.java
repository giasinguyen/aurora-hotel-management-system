package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Base entity class chứa các thuộc tính chung cho tất cả entities
 * - id: Primary key (UUID)
 * - createdAt: Timestamp khi record được tạo
 * - updatedAt: Timestamp khi record được cập nhật lần cuối
 * - createdBy: Username của người tạo record
 * - updatedBy: Username của người cập nhật record lần cuối
 * - version: Version cho Optimistic Locking (prevent race conditions)
 * - deleted: Soft delete flag
 */
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false, length = 100)
    String createdBy;

    @LastModifiedBy
    @Column(length = 100)
    String updatedBy;

    @Version
    @Column(nullable = false)
    @Builder.Default
    Long version = 0L;

    // Soft delete flag - sử dụng cho tất cả entities
    @Column(nullable = false)
    @Builder.Default
    Boolean deleted = false;
}

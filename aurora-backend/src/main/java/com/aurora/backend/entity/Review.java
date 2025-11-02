package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_booking", columnList = "booking_id"),
        @Index(name = "idx_review_customer", columnList = "customer_id"),
        @Index(name = "idx_review_branch", columnList = "branch_id"),
        @Index(name = "idx_review_room", columnList = "room_id"),
        @Index(name = "idx_review_status", columnList = "status"),
        @Index(name = "idx_review_rating", columnList = "rating"),
        @Index(name = "idx_review_date", columnList = "reviewDate")
})
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    Room room; // Optional - có thể review branch/service mà không review specific room

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(nullable = false)
    Integer rating;

    @NotBlank(message = "Comment is required")
    @Size(min = 10, message = "Comment must be at least 10 characters")
    @Column(nullable = false, length = 2000)
    String comment;

    @ElementCollection
    @CollectionTable(name = "review_photos", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "photo_url", length = 500)
    @Size(max = 5, message = "Maximum 5 photos allowed")
    List<String> photos;

    @Column(nullable = false)
    @Builder.Default
    Boolean isVerified = false; // Xác minh review này từ booking thực

    @Column(nullable = false)
    @Builder.Default
    Integer helpfulCount = 0; // Số người thấy review này hữu ích

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    ReviewStatus status = ReviewStatus.PENDING;

    @Column(nullable = false)
    LocalDateTime reviewDate;

    @Column(length = 500)
    String rejectionReason; // Lý do reject review (nếu bị reject)

    LocalDateTime approvedAt;
    
    @Column(length = 100)
    String approvedBy; // Username của người approve

    LocalDateTime rejectedAt;
    
    @Column(length = 100)
    String rejectedBy; // Username của người reject

    // Review Status Enum
    public enum ReviewStatus {
        PENDING,    // Chờ duyệt
        APPROVED,   // Đã duyệt, hiển thị công khai
        REJECTED    // Bị từ chối
    }
}


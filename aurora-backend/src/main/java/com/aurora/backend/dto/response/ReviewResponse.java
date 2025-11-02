package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    String id;
    String bookingId;
    String bookingCode;
    String customerId;
    String customerName;
    String customerAvatarUrl;
    String branchId;
    String branchName;
    String roomId;
    String roomNumber;
    Integer rating;
    String comment;
    List<String> photos;
    Boolean isVerified;
    Integer helpfulCount;
    String status;
    LocalDateTime reviewDate;
    String rejectionReason;
    LocalDateTime approvedAt;
    String approvedBy;
    LocalDateTime rejectedAt;
    String rejectedBy;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}


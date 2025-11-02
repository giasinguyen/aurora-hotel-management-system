package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewStatistics {
    Double averageRating;
    Long totalReviews;
    Map<Integer, Long> ratingDistribution; // Key: rating (1-5), Value: count
}


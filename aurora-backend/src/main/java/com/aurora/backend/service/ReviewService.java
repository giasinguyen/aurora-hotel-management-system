package com.aurora.backend.service;

import com.aurora.backend.dto.request.ReviewCreationRequest;
import com.aurora.backend.dto.request.ReviewUpdateRequest;
import com.aurora.backend.dto.response.ReviewResponse;
import com.aurora.backend.dto.response.ReviewStatistics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    
    /**
     * Create a new review for a booking
     * Business Rules:
     * - Customer must have checked out
     * - Each booking can only be reviewed once
     * - Rating must be 1-5 stars
     * - Comment must be at least 10 characters
     * - Maximum 5 photos
     */
    ReviewResponse createReview(ReviewCreationRequest request);
    
    /**
     * Update an existing review
     * Business Rules:
     * - Only the review owner can update
     * - Can only edit within 24 hours of creation
     */
    ReviewResponse updateReview(String id, ReviewUpdateRequest request);
    
    /**
     * Delete a review (soft delete)
     * Business Rules:
     * - Only the review owner can delete
     */
    void deleteReview(String id);
    
    /**
     * Get review by ID
     */
    ReviewResponse getReviewById(String id);
    
    /**
     * Get all reviews with pagination
     */
    Page<ReviewResponse> getAllReviews(Pageable pageable);
    
    /**
     * Get reviews by branch
     */
    Page<ReviewResponse> getReviewsByBranch(String branchId, Pageable pageable);
    
    /**
     * Get approved reviews by branch (public view)
     */
    Page<ReviewResponse> getApprovedReviewsByBranch(String branchId, Pageable pageable);
    
    /**
     * Get reviews by room
     */
    Page<ReviewResponse> getReviewsByRoom(String roomId, Pageable pageable);
    
    /**
     * Get customer's own reviews
     */
    Page<ReviewResponse> getMyReviews(Pageable pageable);
    
    /**
     * Approve a review (Manager/Admin only)
     */
    ReviewResponse approveReview(String id);
    
    /**
     * Reject a review with reason (Manager/Admin only)
     */
    ReviewResponse rejectReview(String id, String rejectionReason);
    
    /**
     * Get review statistics for a branch
     * Returns: average rating, total reviews, rating distribution (1-5 stars)
     */
    ReviewStatistics getReviewStatisticsByBranch(String branchId);
    
    /**
     * Get top rated reviews by branch (sorted by helpful count and rating)
     */
    Page<ReviewResponse> getTopRatedReviewsByBranch(String branchId, Pageable pageable);
    
    /**
     * Get recent reviews by branch (sorted by review date)
     */
    Page<ReviewResponse> getRecentReviewsByBranch(String branchId, Pageable pageable);
}


package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.ReviewCreationRequest;
import com.aurora.backend.dto.request.ReviewUpdateRequest;
import com.aurora.backend.dto.response.ReviewResponse;
import com.aurora.backend.dto.response.ReviewStatistics;
import com.aurora.backend.entity.*;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.ReviewMapper;
import com.aurora.backend.repository.*;
import com.aurora.backend.service.ReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {
    
    ReviewRepository reviewRepository;
    BookingRepository bookingRepository;
    RoomRepository roomRepository;
    BranchRepository branchRepository;
    UserRepository userRepository;
    ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewCreationRequest request) {
        log.info("Creating review for booking: {}", request.getBookingId());
        
        // Get current user from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        // Validate booking exists
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Validate customer is the one who made the booking
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        
        // Validate customer has checked out
        if (booking.getStatus() != Booking.BookingStatus.CHECKED_OUT && 
            booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new AppException(ErrorCode.REVIEW_NOT_ALLOWED);
        }
        
        // Validate booking not already reviewed
        if (reviewRepository.existsByBooking(booking)) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }
        
        // Create review entity
        Review review = reviewMapper.toReview(request);
        review.setBooking(booking);
        review.setCustomer(customer);
        review.setBranch(booking.getBranch());
        
        // Set room if provided
        if (request.getRoomId() != null && !request.getRoomId().trim().isEmpty()) {
            Room room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
            review.setRoom(room);
        }
        
        // Set default values
        review.setIsVerified(true); // Verified because it's from a real booking
        review.setHelpfulCount(0);
        review.setStatus(Review.ReviewStatus.PENDING);
        review.setReviewDate(LocalDateTime.now());
        
        Review savedReview = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}", savedReview.getId());
        
        return reviewMapper.toReviewResponse(savedReview);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(String id, ReviewUpdateRequest request) {
        log.info("Updating review with ID: {}", id);
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        // Check if user is ADMIN or CUSTOMER owner
        boolean isAdmin = isUserAdmin(currentUser);
        boolean isOwner = review.getCustomer().getId().equals(currentUser.getId());
        
        if (!isAdmin && !isOwner) {
            throw new AppException(ErrorCode.REVIEW_NOT_OWNER);
        }
        
        // Validate 24-hour edit window for CUSTOMER only (ADMIN can update anytime)
        if (!isAdmin && isOwner) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime createdAt = review.getCreatedAt();
            if (createdAt.plusHours(24).isBefore(now)) {
                throw new AppException(ErrorCode.REVIEW_EDIT_EXPIRED);
            }
        }
        
        // Update review
        reviewMapper.updateReview(review, request);
        
        // Reset status to PENDING if it was previously rejected (only for customer edits)
        if (!isAdmin && review.getStatus() == Review.ReviewStatus.REJECTED) {
            review.setStatus(Review.ReviewStatus.PENDING);
            review.setRejectionReason(null);
            review.setRejectedAt(null);
            review.setRejectedBy(null);
        }
        
        Review updatedReview = reviewRepository.save(review);
        log.info("Review updated successfully with ID: {} by user: {} (isAdmin: {})", 
                 updatedReview.getId(), username, isAdmin);
        
        return reviewMapper.toReviewResponse(updatedReview);
    }
    
    /**
     * Check if user is ADMIN
     */
    private boolean isUserAdmin(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            return false;
        }
        
        return user.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    @Override
    @Transactional
    public void deleteReview(String id) {
        log.info("Deleting review with ID: {}", id);
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        // Validate ownership
        if (!review.getCustomer().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.REVIEW_NOT_OWNER);
        }
        
        // Soft delete
        review.setDeleted(true);
        reviewRepository.save(review);
        log.info("Review deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(String id) {
        log.debug("Fetching review with ID: {}", id);
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        log.debug("Fetching all reviews with pagination: {}", pageable);
        
        Page<Review> reviews = reviewRepository.findAll(pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByBranch(String branchId, Pageable pageable) {
        log.debug("Fetching reviews for branch ID: {} with pagination: {}", branchId, pageable);
        
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        Page<Review> reviews = reviewRepository.findByBranch(branch, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getApprovedReviewsByBranch(String branchId, Pageable pageable) {
        log.debug("Fetching approved reviews for branch ID: {} with pagination: {}", branchId, pageable);
        
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        Page<Review> reviews = reviewRepository.findByBranchAndStatus(
            branch, Review.ReviewStatus.APPROVED, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByRoom(String roomId, Pageable pageable) {
        log.debug("Fetching reviews for room ID: {} with pagination: {}", roomId, pageable);
        
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        
        Page<Review> reviews = reviewRepository.findByRoomAndStatus(
            room, Review.ReviewStatus.APPROVED, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getMyReviews(Pageable pageable) {
        log.debug("Fetching current user's reviews with pagination: {}", pageable);
        
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        Page<Review> reviews = reviewRepository.findByCustomer(currentUser, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Override
    @Transactional
    public ReviewResponse approveReview(String id) {
        log.info("Approving review with ID: {}", id);
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        // Validate review is pending
        if (review.getStatus() != Review.ReviewStatus.PENDING) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_MODERATED);
        }
        
        // Get current user (moderator)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        review.setStatus(Review.ReviewStatus.APPROVED);
        review.setApprovedAt(LocalDateTime.now());
        review.setApprovedBy(username);
        
        Review approvedReview = reviewRepository.save(review);
        log.info("Review approved successfully with ID: {}", approvedReview.getId());
        
        return reviewMapper.toReviewResponse(approvedReview);
    }

    @Override
    @Transactional
    public ReviewResponse rejectReview(String id, String rejectionReason) {
        log.info("Rejecting review with ID: {} with reason: {}", id, rejectionReason);
        
        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new AppException(ErrorCode.REJECTION_REASON_REQUIRED);
        }
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        // Validate review is pending
        if (review.getStatus() != Review.ReviewStatus.PENDING) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_MODERATED);
        }
        
        // Get current user (moderator)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        review.setStatus(Review.ReviewStatus.REJECTED);
        review.setRejectionReason(rejectionReason);
        review.setRejectedAt(LocalDateTime.now());
        review.setRejectedBy(username);
        
        Review rejectedReview = reviewRepository.save(review);
        log.info("Review rejected successfully with ID: {}", rejectedReview.getId());
        
        return reviewMapper.toReviewResponse(rejectedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewStatistics getReviewStatisticsByBranch(String branchId) {
        log.debug("Fetching review statistics for branch ID: {}", branchId);
        
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        // Calculate average rating
        Double averageRating = reviewRepository.calculateAverageRatingByBranch(branch);
        if (averageRating == null) {
            averageRating = 0.0;
        }
        
        // Count total reviews
        Long totalReviews = reviewRepository.countApprovedByBranch(branch);
        
        // Build rating distribution (1-5 stars)
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            Long count = reviewRepository.countByBranchAndRating(branch, i);
            ratingDistribution.put(i, count);
        }
        
        return ReviewStatistics.builder()
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .ratingDistribution(ratingDistribution)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getTopRatedReviewsByBranch(String branchId, Pageable pageable) {
        log.debug("Fetching top rated reviews for branch ID: {} with pagination: {}", branchId, pageable);
        
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        Page<Review> reviews = reviewRepository.findTopRatedByBranch(branch, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getRecentReviewsByBranch(String branchId, Pageable pageable) {
        log.debug("Fetching recent reviews for branch ID: {} with pagination: {}", branchId, pageable);
        
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        Page<Review> reviews = reviewRepository.findRecentByBranch(branch, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }
}


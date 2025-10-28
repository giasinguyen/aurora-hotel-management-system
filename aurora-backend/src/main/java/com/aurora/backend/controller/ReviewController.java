package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.ReviewCreationRequest;
import com.aurora.backend.dto.request.ReviewUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.ReviewResponse;
import com.aurora.backend.dto.response.ReviewStatistics;
import com.aurora.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReviewController {
    
    ReviewService reviewService;

    /**
     * POST /reviews - Create a new review
     * Permission: Customer only (after checkout)
     */
    @PostMapping
    @RequirePermission(PermissionConstants.Customer.REVIEW_CREATE)
    public ApiResponse<ReviewResponse> createReview(@Valid @RequestBody ReviewCreationRequest request) {
        ReviewResponse response = reviewService.createReview(request);
        return ApiResponse.<ReviewResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Review created successfully")
                .result(response)
                .build();
    }

    /**
     * PUT /reviews/{id} - Update an existing review
     * Permissions:
     * - Customer: Can update own reviews (within 24h)
     * - Admin: Can update all reviews (no time limit)
     * - Staff & Manager: CANNOT update reviews
     */
    @PutMapping("/{id}")
    @RequirePermission({
        PermissionConstants.Customer.REVIEW_UPDATE_OWN,
        PermissionConstants.Admin.REVIEW_UPDATE_ALL
    })
    public ApiResponse<ReviewResponse> updateReview(
            @PathVariable String id, 
            @Valid @RequestBody ReviewUpdateRequest request) {
        ReviewResponse response = reviewService.updateReview(id, request);
        return ApiResponse.<ReviewResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Review updated successfully")
                .result(response)
                .build();
    }

    /**
     * DELETE /reviews/{id} - Delete a review (soft delete)
     * Permission: Customer (own reviews only)
     */
    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.REVIEW_DELETE_OWN)
    public ApiResponse<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Review deleted successfully")
                .build();
    }

    /**
     * GET /reviews/{id} - Get review details by ID
     * Permission: Staff, Manager, Admin
     */
    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Staff.REVIEW_VIEW_ALL)
    public ApiResponse<ReviewResponse> getReviewById(@PathVariable String id) {
        ReviewResponse response = reviewService.getReviewById(id);
        return ApiResponse.<ReviewResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Review retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews - Get all reviews
     * Permission: Staff, Manager, Admin
     */
    @GetMapping
    @RequirePermission(PermissionConstants.Staff.REVIEW_VIEW_ALL)
    public ApiResponse<Page<ReviewResponse>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ReviewResponse> response = reviewService.getAllReviews(pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Reviews retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews/branch/{branchId} - Get all reviews for a branch
     * Permission: Staff, Manager, Admin
     */
    @GetMapping("/branch/{branchId}")
    @RequirePermission(PermissionConstants.Staff.REVIEW_VIEW_ALL)
    public ApiResponse<Page<ReviewResponse>> getReviewsByBranch(
            @PathVariable String branchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ReviewResponse> response = reviewService.getReviewsByBranch(branchId, pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Branch reviews retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews/branch/{branchId}/approved - Get approved reviews for a branch (public)
     * Permission: Guest (no authentication required)
     */
    @GetMapping("/branch/{branchId}/approved")
    public ApiResponse<Page<ReviewResponse>> getApprovedReviewsByBranch(
            @PathVariable String branchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ReviewResponse> response = reviewService.getApprovedReviewsByBranch(branchId, pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Approved reviews retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews/room/{roomId} - Get reviews for a specific room
     * Permission: Guest (public approved reviews)
     */
    @GetMapping("/room/{roomId}")
    public ApiResponse<Page<ReviewResponse>> getReviewsByRoom(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ReviewResponse> response = reviewService.getReviewsByRoom(roomId, pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Room reviews retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews/my-reviews - Get current customer's own reviews
     * Permission: Customer
     */
    @GetMapping("/my-reviews")
    @RequirePermission(PermissionConstants.Customer.REVIEW_CREATE)
    public ApiResponse<Page<ReviewResponse>> getMyReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ReviewResponse> response = reviewService.getMyReviews(pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Your reviews retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * PATCH /reviews/{id}/approve - Approve a review
     * Permission: Manager, Admin
     */
    @PatchMapping("/{id}/approve")
    @RequirePermission(PermissionConstants.Manager.REVIEW_MODERATE)
    public ApiResponse<ReviewResponse> approveReview(@PathVariable String id) {
        ReviewResponse response = reviewService.approveReview(id);
        return ApiResponse.<ReviewResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Review approved successfully")
                .result(response)
                .build();
    }

    /**
     * PATCH /reviews/{id}/reject - Reject a review with reason
     * Permission: Manager, Admin
     */
    @PatchMapping("/{id}/reject")
    @RequirePermission(PermissionConstants.Manager.REVIEW_MODERATE)
    public ApiResponse<ReviewResponse> rejectReview(
            @PathVariable String id,
            @RequestParam String reason) {
        ReviewResponse response = reviewService.rejectReview(id, reason);
        return ApiResponse.<ReviewResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Review rejected successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews/statistics/branch/{branchId} - Get review statistics for a branch
     * Permission: Public
     */
    @GetMapping("/statistics/branch/{branchId}")
    public ApiResponse<ReviewStatistics> getReviewStatisticsByBranch(@PathVariable String branchId) {
        ReviewStatistics response = reviewService.getReviewStatisticsByBranch(branchId);
        return ApiResponse.<ReviewStatistics>builder()
                .code(HttpStatus.OK.value())
                .message("Review statistics retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews/branch/{branchId}/top-rated - Get top rated reviews for a branch
     * Permission: Public
     */
    @GetMapping("/branch/{branchId}/top-rated")
    public ApiResponse<Page<ReviewResponse>> getTopRatedReviewsByBranch(
            @PathVariable String branchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewResponse> response = reviewService.getTopRatedReviewsByBranch(branchId, pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Top rated reviews retrieved successfully")
                .result(response)
                .build();
    }

    /**
     * GET /reviews/branch/{branchId}/recent - Get recent reviews for a branch
     * Permission: Public
     */
    @GetMapping("/branch/{branchId}/recent")
    public ApiResponse<Page<ReviewResponse>> getRecentReviewsByBranch(
            @PathVariable String branchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewResponse> response = reviewService.getRecentReviewsByBranch(branchId, pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Recent reviews retrieved successfully")
                .result(response)
                .build();
    }
}


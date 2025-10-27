package com.aurora.backend.repository;

import com.aurora.backend.entity.Review;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Room;
import com.aurora.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    
    // Check if review exists for a booking
    boolean existsByBooking(Booking booking);
    
    Optional<Review> findByBooking(Booking booking);
    
    // Find reviews by branch
    Page<Review> findByBranch(Branch branch, Pageable pageable);
    
    Page<Review> findByBranchAndStatus(Branch branch, Review.ReviewStatus status, Pageable pageable);
    
    // Find reviews by customer
    Page<Review> findByCustomer(User customer, Pageable pageable);
    
    // Find reviews by room
    Page<Review> findByRoom(Room room, Pageable pageable);
    
    Page<Review> findByRoomAndStatus(Room room, Review.ReviewStatus status, Pageable pageable);
    
    // Find by status
    Page<Review> findByStatus(Review.ReviewStatus status, Pageable pageable);
    
    // Calculate average rating for a branch
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.branch = :branch AND r.status = 'APPROVED'")
    Double calculateAverageRatingByBranch(@Param("branch") Branch branch);
    
    // Calculate average rating for a room
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.room = :room AND r.status = 'APPROVED'")
    Double calculateAverageRatingByRoom(@Param("room") Room room);
    
    // Count reviews by rating for a branch
    @Query("SELECT COUNT(r) FROM Review r WHERE r.branch = :branch AND r.rating = :rating AND r.status = 'APPROVED'")
    Long countByBranchAndRating(@Param("branch") Branch branch, @Param("rating") Integer rating);
    
    // Count total approved reviews for a branch
    @Query("SELECT COUNT(r) FROM Review r WHERE r.branch = :branch AND r.status = 'APPROVED'")
    Long countApprovedByBranch(@Param("branch") Branch branch);
    
    // Find top rated reviews (by helpful count)
    @Query("SELECT r FROM Review r WHERE r.branch = :branch AND r.status = 'APPROVED' ORDER BY r.helpfulCount DESC, r.rating DESC")
    Page<Review> findTopRatedByBranch(@Param("branch") Branch branch, Pageable pageable);
    
    // Find recent reviews
    @Query("SELECT r FROM Review r WHERE r.branch = :branch AND r.status = 'APPROVED' ORDER BY r.reviewDate DESC")
    Page<Review> findRecentByBranch(@Param("branch") Branch branch, Pageable pageable);
}


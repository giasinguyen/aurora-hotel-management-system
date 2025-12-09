package com.aurora.backend.repository;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByBookingCode(String bookingCode);
    Optional<Booking> findByBookingCode(String bookingCode);
    
    @Query("SELECT DISTINCT b FROM Booking b " +
           "LEFT JOIN FETCH b.rooms br " +
           "LEFT JOIN FETCH br.room r " +
           "LEFT JOIN FETCH r.roomType rt " +
           "WHERE b.bookingCode = :code")
    Optional<Booking> findByBookingCodeWithRooms(@Param("code") String code);
    
    @Query("SELECT DISTINCT b FROM Booking b " +
           "LEFT JOIN FETCH b.rooms br " +
           "LEFT JOIN FETCH br.room r " +
           "LEFT JOIN FETCH r.roomType rt " +
           "WHERE b.id = :id")
    Optional<Booking> findByIdWithRooms(@Param("id") String id);
    Page<Booking> findByCustomerId(String customerId, Pageable pageable);
    Page<Booking> findByBranchId(String BranchId, Pageable pageable);
    Page<Booking> findByStatus(String status, Pageable pageable);
    Page<Booking> findByCheckinBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    Page<Booking> findByBranch(Branch Branch, Pageable pageable);
    Page<Booking> findByCustomer(User customer, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE " +
           "(:branch IS NULL OR b.branch = :branch) AND " +
           "(:customer IS NULL OR b.customer = :customer) AND " +
           "(:statusEnum IS NULL OR b.status = :statusEnum)")
    Page<Booking> findByFilters(@Param("branch") Branch branch,
                               @Param("customer") User customer,
                               @Param("statusEnum") Booking.BookingStatus statusEnum,
                               Pageable pageable);
    // =================================================================
    // (STATISTICS & DASHBOARD)
    // =================================================================

    // Bookings that overlap with the date range (checkin <= end AND checkout >= start)
    @Query("SELECT b FROM Booking b WHERE b.checkin <= :end AND b.checkout >= :start " +
            "AND (:branchId IS NULL OR b.branch.id = :branchId)")
    List<Booking> findAllWithinDateRange(@Param("start") LocalDate start,
                                         @Param("end") LocalDate end,
                                         @Param("branchId") String branchId);

    // Count bookings that overlap with the date range
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.checkin <= :end AND b.checkout >= :start " +
            "AND (:branchId IS NULL OR b.branch.id = :branchId) " +
            "AND (:status IS NULL OR b.status = :status)")
    long countBookingsWithinDateRange(@Param("start") LocalDate start,
                                      @Param("end") LocalDate end,
                                      @Param("status") Booking.BookingStatus status,
                                      @Param("branchId") String branchId);

    // Sum total price of bookings that overlap with the date range
    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.checkin <= :end AND b.checkout >= :start " +
            "AND (:branchId IS NULL OR b.branch.id = :branchId)")
    BigDecimal sumBookingTotalPrice(@Param("start") LocalDate start,
                                    @Param("end") LocalDate end,
                                    @Param("branchId") String branchId);

    @Query("SELECT COUNT(DISTINCT b.customer.id) FROM Booking b WHERE b.checkin BETWEEN :start AND :end " +
            "AND (:branchId IS NULL OR b.branch.id = :branchId) " +
            "AND NOT EXISTS (SELECT 1 FROM Booking b2 WHERE b2.customer = b.customer AND b2.checkin < :start)")
    long countFirstTimeCustomers(@Param("start") LocalDate start,
                                 @Param("end") LocalDate end,
                                 @Param("branchId") String branchId);

    @Query("SELECT COUNT(DISTINCT b.customer.id) FROM Booking b WHERE b.checkin BETWEEN :start AND :end " +
            "AND (:branchId IS NULL OR b.branch.id = :branchId) " +
            "AND EXISTS (SELECT 1 FROM Booking b2 WHERE b2.customer = b.customer AND b2.checkin < :start)")
    long countReturningCustomers(@Param("start") LocalDate start,
                                 @Param("end") LocalDate end,
                                 @Param("branchId") String branchId);

    @Query("SELECT COALESCE(b.createdBy, 'UNKNOWN') AS source, COUNT(b) AS total " +
            "FROM Booking b WHERE b.checkin BETWEEN :start AND :end " +
            "AND (:branchId IS NULL OR b.branch.id = :branchId) " +
            "GROUP BY COALESCE(b.createdBy, 'UNKNOWN')")
    List<Object[]> countBookingsBySource(@Param("start") LocalDate start,
                                         @Param("end") LocalDate end,
                                         @Param("branchId") String branchId);
//------
    
    @Query("SELECT b.id FROM Booking b JOIN b.rooms br WHERE " +
           "br.room.id = :roomId AND " +
           "b.status IN :statuses AND " +
           "b.checkin < :checkoutDate AND " +
           "b.checkout > :checkinDate")
    List<String> findConflictingBookings(
            @Param("roomId") String roomId,
            @Param("checkinDate") LocalDate checkinDate,
            @Param("checkoutDate") LocalDate checkoutDate,
            @Param("statuses") List<Booking.BookingStatus> statuses
    );
    
   
    @Query("SELECT b.id FROM Booking b JOIN b.rooms br WHERE " +
           "br.room.id = :roomId AND " +
           "b.id != :excludeId AND " +
           "b.status IN :statuses AND " +
           "b.checkin < :checkoutDate AND " +
           "b.checkout > :checkinDate")
    List<String> findConflictingBookingsExcluding(
            @Param("roomId") String roomId,
            @Param("checkinDate") LocalDate checkinDate,
            @Param("checkoutDate") LocalDate checkoutDate,
            @Param("statuses") List<Booking.BookingStatus> statuses,
            @Param("excludeId") String excludeBookingId
    );

}

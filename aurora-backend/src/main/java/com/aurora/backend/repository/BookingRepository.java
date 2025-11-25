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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByBookingCode(String bookingCode);
    Optional<Booking> findByBookingCode(String bookingCode);
    Page<Booking> findByCustomerId(String customerId, Pageable pageable);
    Page<Booking> findByBranchId(String BranchId, Pageable pageable);
    Page<Booking> findByStatus(String status, Pageable pageable);
    Page<Booking> findByCheckinBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    Page<Booking> findByBranch(Branch Branch, Pageable pageable);
    Page<Booking> findByCustomer(User customer, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE " +
           "(:Branch IS NULL OR b.branch = :Branch) AND " +
           "(:customer IS NULL OR b.customer = :customer) AND " +
           "(:status IS NULL OR :status = '' OR b.status = :status)")
    Page<Booking> findByFilters(@Param("Branch") Branch Branch,
                               @Param("customer") User customer,
                               @Param("status") String status,
                               Pageable pageable);
    
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

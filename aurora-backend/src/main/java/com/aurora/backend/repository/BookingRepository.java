package com.aurora.backend.repository;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Hotel;
import com.aurora.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByBookingCode(String bookingCode);
    Optional<Booking> findByBookingCode(String bookingCode);
    Page<Booking> findByCustomerId(String customerId, Pageable pageable);
    Page<Booking> findByHotelId(String hotelId, Pageable pageable);
    Page<Booking> findByStatus(String status, Pageable pageable);
    Page<Booking> findByCheckinBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    // Additional methods with entities for service layer
    Page<Booking> findByHotel(Hotel hotel, Pageable pageable);
    Page<Booking> findByCustomer(User customer, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE " +
           "(:hotel IS NULL OR b.hotel = :hotel) AND " +
           "(:customer IS NULL OR b.customer = :customer) AND " +
           "(:status IS NULL OR :status = '' OR b.status = :status)")
    Page<Booking> findByFilters(@Param("hotel") Hotel hotel,
                               @Param("customer") User customer,
                               @Param("status") String status,
                               Pageable pageable);
}

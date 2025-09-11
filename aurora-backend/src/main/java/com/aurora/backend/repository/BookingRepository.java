package com.aurora.backend.repository;

import com.aurora.backend.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

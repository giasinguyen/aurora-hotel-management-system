package com.aurora.backend.repository;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByBookingId(String bookingId);
    Page<Payment> findByBookingId(String bookingId, Pageable pageable);
    Page<Payment> findByMethod(String method, Pageable pageable);
    Page<Payment> findByStatus(String status, Pageable pageable);
    Optional<Payment> findByProviderTxnId(String providerTxnId);
    
    // Additional methods with entities for service layer
    Page<Payment> findByBooking(Booking booking, Pageable pageable);
    
    @Query("SELECT p FROM Payment p WHERE " +
           "(:booking IS NULL OR p.booking = :booking) AND " +
           "(:method IS NULL OR :method = '' OR p.method = :method) AND " +
           "(:status IS NULL OR :status = '' OR p.status = :status)")
    Page<Payment> findByFilters(@Param("booking") Booking booking,
                               @Param("method") String method,
                               @Param("status") String status,
                               Pageable pageable);
}

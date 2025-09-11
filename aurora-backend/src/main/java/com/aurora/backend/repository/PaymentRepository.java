package com.aurora.backend.repository;

import com.aurora.backend.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

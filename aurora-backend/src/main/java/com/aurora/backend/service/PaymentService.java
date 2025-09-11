package com.aurora.backend.service;

import com.aurora.backend.dto.request.PaymentCreationRequest;
import com.aurora.backend.dto.request.PaymentUpdateRequest;
import com.aurora.backend.dto.response.PaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    PaymentResponse createPayment(PaymentCreationRequest request);
    PaymentResponse updatePayment(String id, PaymentUpdateRequest request);
    void deletePayment(String id);
    PaymentResponse getPaymentById(String id);
    Page<PaymentResponse> getAllPayments(Pageable pageable);
    Page<PaymentResponse> getPaymentsByBooking(String bookingId, Pageable pageable);
    Page<PaymentResponse> getPaymentsByMethod(String method, Pageable pageable);
    Page<PaymentResponse> getPaymentsByStatus(String status, Pageable pageable);
    Page<PaymentResponse> searchPayments(String bookingId, String method, String status, Pageable pageable);
}

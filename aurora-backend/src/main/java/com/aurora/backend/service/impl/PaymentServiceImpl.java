package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.PaymentCreationRequest;
import com.aurora.backend.dto.request.PaymentUpdateRequest;
import com.aurora.backend.dto.response.PaymentResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Payment;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.PaymentMapper;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.PaymentRepository;
import com.aurora.backend.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    
    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    PaymentMapper paymentMapper;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentCreationRequest request) {
        log.info("Creating payment for booking: {}", request.getBookingId());
        
        // Validate booking exists
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        Payment payment = paymentMapper.toPayment(request);
        payment.setBooking(booking);
        
        // Set default status if not provided
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            payment.setStatus("PENDING");
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment created successfully with ID: {}", savedPayment.getId());
        
        return paymentMapper.toPaymentResponse(savedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse updatePayment(String id, PaymentUpdateRequest request) {
        log.info("Updating payment with ID: {}", id);
        
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_EXISTED));
        
        paymentMapper.updatePayment(payment, request);
        
        Payment updatedPayment = paymentRepository.save(payment);
        log.info("Payment updated successfully with ID: {}", updatedPayment.getId());
        
        return paymentMapper.toPaymentResponse(updatedPayment);
    }

    @Override
    @Transactional
    public void deletePayment(String id) {
        log.info("Deleting payment with ID: {}", id);
        
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_EXISTED));
        
        paymentRepository.delete(payment);
        log.info("Payment deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(String id) {
        log.debug("Fetching payment with ID: {}", id);
        
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_EXISTED));
        
        return paymentMapper.toPaymentResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        log.debug("Fetching all payments with pagination: {}", pageable);
        
        Page<Payment> payments = paymentRepository.findAll(pageable);
        return payments.map(paymentMapper::toPaymentResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByBooking(String bookingId, Pageable pageable) {
        log.debug("Fetching payments for booking ID: {} with pagination: {}", bookingId, pageable);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        Page<Payment> payments = paymentRepository.findByBooking(booking, pageable);
        return payments.map(paymentMapper::toPaymentResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByMethod(String method, Pageable pageable) {
        log.debug("Fetching payments with method: {} with pagination: {}", method, pageable);
        
        Page<Payment> payments = paymentRepository.findByMethod(method, pageable);
        return payments.map(paymentMapper::toPaymentResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByStatus(String status, Pageable pageable) {
        log.debug("Fetching payments with status: {} with pagination: {}", status, pageable);
        
        Page<Payment> payments = paymentRepository.findByStatus(status, pageable);
        return payments.map(paymentMapper::toPaymentResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> searchPayments(String bookingId, String method, String status, Pageable pageable) {
        log.debug("Searching payments with filters - Booking: {}, Method: {}, Status: {}", bookingId, method, status);
        
        Booking booking = null;
        if (bookingId != null && !bookingId.trim().isEmpty()) {
            booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        }
        
        Page<Payment> payments = paymentRepository.findByFilters(booking, method, status, pageable);
        return payments.map(paymentMapper::toPaymentResponse);
    }
}

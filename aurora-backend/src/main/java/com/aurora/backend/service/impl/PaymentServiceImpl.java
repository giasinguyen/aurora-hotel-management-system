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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {
    
    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    PaymentMapper paymentMapper;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentCreationRequest request) {
        log.info("Creating payment for booking: {}", request.getBookingId());
        
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        validatePaymentAmount(booking, BigDecimal.valueOf(request.getAmount()));
        
        Payment payment = paymentMapper.toPayment(request);
        payment.setBooking(booking);
        
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            payment.setStatus(Payment.PaymentStatus.PENDING);
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        
        if (savedPayment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            updateBookingPaymentStatus(booking);
        }
        
        log.info("Payment created successfully with ID: {}", savedPayment.getId());
        
        return paymentMapper.toPaymentResponse(savedPayment);
    }

    private void validatePaymentAmount(Booking booking, BigDecimal paymentAmount) {
        if (paymentAmount == null || paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_AMOUNT);
        }
        
        BigDecimal totalPaid = paymentRepository.getTotalPaidAmount(booking.getId());
        
        BigDecimal totalPrice = booking.getTotalPrice();
        if (totalPrice == null || totalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_BOOKING_TOTAL);
        }
        
        BigDecimal remaining = totalPrice.subtract(totalPaid);
        
        if (paymentAmount.compareTo(remaining) > 0) {
            log.warn("Payment amount {} exceeds remaining {} for booking {}", 
                paymentAmount, remaining, booking.getId());
            throw new AppException(ErrorCode.PAYMENT_EXCEEDS_TOTAL);
        }
        
        log.debug("Payment validation passed: amount={}, totalPaid={}, remaining={}", 
            paymentAmount, totalPaid, remaining);
    }

    private void updateBookingPaymentStatus(Booking booking) {
        BigDecimal totalPaid = paymentRepository.getTotalPaidAmount(booking.getId());
        BigDecimal totalPrice = booking.getTotalPrice();
        BigDecimal depositAmount = booking.getDepositAmount();
        
        Booking.PaymentStatus newStatus;
        
        if (totalPaid.compareTo(totalPrice) >= 0) {
            newStatus = Booking.PaymentStatus.PAID;
        } else if (depositAmount != null && totalPaid.compareTo(depositAmount) >= 0) {
            newStatus = Booking.PaymentStatus.DEPOSIT_PAID;
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            newStatus = Booking.PaymentStatus.PARTIALLY_PAID;
        } else {
            newStatus = Booking.PaymentStatus.PENDING;
        }
        
        if (booking.getPaymentStatus() != newStatus) {
            booking.setPaymentStatus(newStatus);
            bookingRepository.save(booking);
            log.info("Updated booking {} payment status to {}", booking.getId(), newStatus);
        }
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

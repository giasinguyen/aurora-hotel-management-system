package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.BookingCancellationRequest;
import com.aurora.backend.dto.request.BookingConfirmRequest;
import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingModificationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.BookingCancellationResponse;
import com.aurora.backend.dto.response.BookingResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.User;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.BookingMapper;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.service.BookingService;
import com.aurora.backend.service.RefundService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {
    
    BookingRepository bookingRepository;
    BranchRepository branchRepository;
    UserRepository userRepository;
    BookingMapper bookingMapper;
    RefundService refundService;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreationRequest request) {
        log.info("Creating booking for branch: {} and customer: {}", request.getBranchId(), request.getCustomerId());
        
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        Booking booking = bookingMapper.toBooking(request);
        booking.setBranch(branch);
        booking.setCustomer(customer);
        
        String bookingCode = generateBookingCode();
        while (bookingRepository.existsByBookingCode(bookingCode)) {
            bookingCode = generateBookingCode();
        }
        booking.setBookingCode(bookingCode);
        
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            booking.setStatus(Booking.BookingStatus.PENDING);
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with ID: {} and code: {}", savedBooking.getId(), savedBooking.getBookingCode());
        
        return bookingMapper.toBookingResponse(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponse updateBooking(String id, BookingUpdateRequest request) {
        log.info("Updating booking with ID: {}", id);
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        bookingMapper.updateBooking(booking, request);
        
        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking updated successfully with ID: {}", updatedBooking.getId());
        
        return bookingMapper.toBookingResponse(updatedBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(String id) {
        log.info("Deleting booking with ID: {}", id);
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        bookingRepository.delete(booking);
        log.info("Booking deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(String id) {
        log.debug("Fetching booking with ID: {}", id);
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        return bookingMapper.toBookingResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        log.debug("Fetching all bookings with pagination: {}", pageable);
        
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(bookingMapper::toBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingsByBranch(String branchId, Pageable pageable) {
        log.debug("Fetching bookings for branch ID: {} with pagination: {}", branchId, pageable);
        
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        Page<Booking> bookings = bookingRepository.findByBranch(branch, pageable);
        return bookings.map(bookingMapper::toBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingsByCustomer(String customerId, Pageable pageable) {
        log.debug("Fetching bookings for customer ID: {} with pagination: {}", customerId, pageable);
        
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        Page<Booking> bookings = bookingRepository.findByCustomer(customer, pageable);
        return bookings.map(bookingMapper::toBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> searchBookings(String branchId, String customerId, String status, Pageable pageable) {
        log.debug("Searching bookings with filters - branch: {}, Customer: {}, Status: {}", branchId, customerId, status);
        
        Branch branch = null;
        User customer = null;
        
        if (branchId != null && !branchId.trim().isEmpty()) {
            branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        }
        
        if (customerId != null && !customerId.trim().isEmpty()) {
            customer = userRepository.findById(customerId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }
        
        Page<Booking> bookings = bookingRepository.findByFilters(branch, customer, status, pageable);
        return bookings.map(bookingMapper::toBookingResponse);
    }
    
    private String generateBookingCode() {
        return "BK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
    
    // ==================== BOOKING WORKFLOW IMPLEMENTATIONS ====================
    
    @Override
    @Transactional
    public BookingResponse confirmBooking(BookingConfirmRequest request) {
        log.info("Confirming booking: {}", request.getBookingId());
        
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Validate current status
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new AppException(ErrorCode.BOOKING_NOT_EXISTED); // Custom error needed
        }
        
        // Update status to CONFIRMED
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        
        // TODO: Send confirmation email/SMS
        booking.setEmailSent(true);
        
        Booking confirmedBooking = bookingRepository.save(booking);
        log.info("Booking confirmed successfully: {}", confirmedBooking.getBookingCode());
        
        return bookingMapper.toBookingResponse(confirmedBooking);
    }
    
    @Override
    @Transactional
    public BookingResponse modifyBooking(BookingModificationRequest request) {
        log.info("Modifying booking: {}", request.getBookingId());
        
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Validate modification is allowed (24h before checkin)
        long hoursUntilCheckin = ChronoUnit.HOURS.between(LocalDateTime.now(), booking.getCheckin().atStartOfDay());
        if (hoursUntilCheckin < 24) {
            throw new AppException(ErrorCode.BOOKING_NOT_EXISTED); // Custom error: MODIFICATION_TOO_LATE
        }
        
        // Validate booking status
        if (booking.getStatus() != Booking.BookingStatus.PENDING && 
            booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new AppException(ErrorCode.BOOKING_NOT_EXISTED); // Custom error: CANNOT_MODIFY_BOOKING
        }
        
        // Update booking details
        if (request.getNewCheckin() != null) {
            booking.setCheckin(request.getNewCheckin());
        }
        
        if (request.getNewCheckout() != null) {
            booking.setCheckout(request.getNewCheckout());
        }
        
        Booking modifiedBooking = bookingRepository.save(booking);
        log.info("Booking modified successfully: {}", modifiedBooking.getBookingCode());
        
        return bookingMapper.toBookingResponse(modifiedBooking);
    }
    
    @Override
    @Transactional
    public BookingCancellationResponse cancelBooking(BookingCancellationRequest request) {
        log.info("Cancelling booking: {}", request.getBookingId());
        
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Validate booking can be cancelled
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED ||
            booking.getStatus() == Booking.BookingStatus.COMPLETED ||
            booking.getStatus() == Booking.BookingStatus.CHECKED_OUT) {
            throw new AppException(ErrorCode.BOOKING_NOT_EXISTED); // Custom error: CANNOT_CANCEL_BOOKING
        }
        
        // Calculate refund
        long daysUntilCheckin = ChronoUnit.DAYS.between(LocalDate.now(), booking.getCheckin());
        BigDecimal refundAmount = refundService.calculateRefundAmount(booking);
        int refundPercentage = refundService.getRefundPercentage(daysUntilCheckin);
        String refundPolicy = refundService.getRefundPolicyExplanation(daysUntilCheckin);
        
        // Update booking status
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(request.getReason());
        
        // Process refund
        if (refundAmount.compareTo(BigDecimal.ZERO) > 0) {
            refundService.processRefund(booking, refundAmount);
        }
        
        bookingRepository.save(booking);
        
        log.info("Booking cancelled: {} with refund: {} VND ({}%)", 
                 booking.getBookingCode(), refundAmount, refundPercentage);
        
        return BookingCancellationResponse.builder()
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .cancelledAt(booking.getCancelledAt())
                .cancellationReason(booking.getCancellationReason())
                .refundAmount(refundAmount)
                .refundPercentage(refundPercentage)
                .refundPolicy(refundPolicy)
                .message("Booking cancelled successfully")
                .build();
    }
    
    @Override
    @Transactional
    public BookingResponse checkInBooking(String bookingId, String checkedInBy) {
        log.info("Checking in booking: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Validate status
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new AppException(ErrorCode.BOOKING_NOT_CONFIRMED);
        }
        
        // Update status
        booking.setStatus(Booking.BookingStatus.CHECKED_IN);
        booking.setActualCheckinTime(LocalDateTime.now());
        booking.setCheckedInBy(checkedInBy);
        
        Booking checkedInBooking = bookingRepository.save(booking);
        log.info("Booking checked in successfully: {}", checkedInBooking.getBookingCode());
        
        return bookingMapper.toBookingResponse(checkedInBooking);
    }
    
    @Override
    @Transactional
    public BookingResponse checkOutBooking(String bookingId, String checkedOutBy) {
        log.info("Checking out booking: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Validate status
        if (booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
            throw new AppException(ErrorCode.BOOKING_NOT_EXISTED); // Custom error needed
        }
        
        // Update status
        booking.setStatus(Booking.BookingStatus.CHECKED_OUT);
        booking.setActualCheckoutTime(LocalDateTime.now());
        booking.setCheckedOutBy(checkedOutBy);
        
        Booking checkedOutBooking = bookingRepository.save(booking);
        
        // Auto-complete after checkout
        checkedOutBooking.setStatus(Booking.BookingStatus.COMPLETED);
        bookingRepository.save(checkedOutBooking);
        
        log.info("Booking checked out and completed: {}", checkedOutBooking.getBookingCode());
        
        return bookingMapper.toBookingResponse(checkedOutBooking);
    }
    
    @Override
    @Transactional
    public BookingResponse markNoShow(String bookingId, String reason) {
        log.info("Marking booking as no-show: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Update status
        booking.setStatus(Booking.BookingStatus.NO_SHOW);
        booking.setCancellationReason(reason);
        booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED); // No refund for no-show
        
        Booking noShowBooking = bookingRepository.save(booking);
        log.info("Booking marked as no-show: {}", noShowBooking.getBookingCode());
        
        return bookingMapper.toBookingResponse(noShowBooking);
    }
    
    @Override
    @Transactional
    public void autoConfirmAfterPayment(String bookingId) {
        log.info("Auto-confirming booking after payment: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Auto-confirm only if PENDING and payment is PAID
        if (booking.getStatus() == Booking.BookingStatus.PENDING &&
            booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
            
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking.setEmailSent(true); // TODO: Send confirmation email
            
            bookingRepository.save(booking);
            log.info("Booking auto-confirmed: {}", booking.getBookingCode());
        }
    }
}

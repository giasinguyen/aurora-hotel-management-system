package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.BookingCancellationRequest;
import com.aurora.backend.dto.request.BookingConfirmRequest;
import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingModificationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.request.CheckoutRequest;
import com.aurora.backend.dto.response.BookingCancellationResponse;
import com.aurora.backend.dto.response.BookingResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.User;
import com.aurora.backend.entity.Room;
import com.aurora.backend.entity.Service;
import com.aurora.backend.entity.BookingRoom;
import com.aurora.backend.entity.ServiceBooking;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.BookingMapper;
import com.aurora.backend.mapper.BookingRoomMapper;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.repository.RoomRepository;
import com.aurora.backend.repository.ServiceRepository;
import com.aurora.backend.repository.BookingRoomRepository;
import com.aurora.backend.repository.ServiceBookingRepository;
import com.aurora.backend.service.BookingService;
import com.aurora.backend.service.EmailService;
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
    RoomRepository roomRepository;
    ServiceRepository serviceRepository;
    BookingRoomRepository bookingRoomRepository;
    ServiceBookingRepository serviceBookingRepository;
    BookingMapper bookingMapper;
    RefundService refundService;
    EmailService emailService;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreationRequest request) {
        log.info("Creating booking for branch: {} and customer: {}", request.getBranchId(), request.getCustomerId());
        
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        Booking booking = bookingMapper.toBooking(request);
        booking.setBranch(branch);
        
        // Set customer if provided
        if (request.getCustomerId() != null && !request.getCustomerId().trim().isEmpty()) {
            User customer = userRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            booking.setCustomer(customer);
            log.info("Creating booking for customer: {}", customer.getUsername());
        } else {
            booking.setCustomer(null);
            log.info("Creating booking for walk-in guest: {}", request.getGuestFullName());
        }
        
        // Always set guest information (from form)
        // This is useful even for logged-in customers (e.g., booking for someone else, contact backup)
        booking.setGuestFullName(request.getGuestFullName());
        booking.setGuestEmail(request.getGuestEmail());
        booking.setGuestPhone(request.getGuestPhone());
        log.info("Guest info set - Name: {}, Email: {}, Phone: {}", 
                request.getGuestFullName(), request.getGuestEmail(), request.getGuestPhone());
        
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
    public BookingResponse getBookingByCode(String code) {
        log.debug("Fetching booking with code: {}", code);
        
        Booking booking = bookingRepository.findByBookingCode(code)
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
        
        // Verify customer exists
        userRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        // Use findByCustomerId to handle both authenticated and guest bookings
        Page<Booking> bookings = bookingRepository.findByCustomerId(customerId, pageable);
        
        log.debug("Found {} bookings for customer {}", bookings.getTotalElements(), customerId);
        
        return bookings.map(bookingMapper::toBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> searchBookings(String branchId, String customerId, String status, Pageable pageable) {
        log.debug("Searching bookings with filters - branch: {}, Customer: {}, Status: {}", branchId, customerId, status);
        
        Branch branch = null;
        User customer = null;
        Booking.BookingStatus bookingStatus = null;
        
        if (branchId != null && !branchId.trim().isEmpty()) {
            branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        }
        
        if (customerId != null && !customerId.trim().isEmpty()) {
            customer = userRepository.findById(customerId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }
        
        if (status != null && !status.trim().isEmpty()) {
            try {
                bookingStatus = Booking.BookingStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid booking status: {}", status);
                // Return empty page for invalid status
                return Page.empty(pageable);
            }
        }
        
        Page<Booking> bookings = bookingRepository.findByFilters(branch, customer, bookingStatus, pageable);
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
    
    @Override
    @Transactional
    public BookingResponse checkoutComplete(CheckoutRequest request) {
        log.info("Processing complete checkout for branch: {}", request.getBranchId());
        
        // Validate payment success - only create booking if payment is successful
        if (request.getPaymentSuccess() == null || !request.getPaymentSuccess()) {
            log.warn("Payment not successful - booking will not be created. Payment method: {}", request.getPaymentMethod());
            throw new AppException(ErrorCode.PAYMENT_NOT_SUCCESSFUL); // You may need to add this error code
        }
        
        log.info("Payment confirmed successful - proceeding with booking creation");
        
        // 1. Create Booking
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        // Set initial booking status based on payment method
        // For VNPay: Set CONFIRMED so payment can be created, will be updated after payment result
        // For Cash: Set PENDING initially
        Booking.BookingStatus initialStatus = "vnpay".equals(request.getPaymentMethod()) 
                ? Booking.BookingStatus.CONFIRMED 
                : Booking.BookingStatus.PENDING;
        
        Booking booking = Booking.builder()
                .branch(branch)
                .checkin(request.getCheckIn())
                .checkout(request.getCheckOut())
                .status(initialStatus)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .specialRequest(request.getSpecialRequests())
                .build();
        
        // Set customer if provided and exists
        // Note: If customerId is provided but user not found, try to find by email as fallback
        // (This handles cases where seed data was re-run and user IDs changed)
        if (request.getCustomerId() != null && !request.getCustomerId().trim().isEmpty()) {
            User customer = null;
            
            try {
                // First try: Find by ID
                customer = userRepository.findById(request.getCustomerId())
                        .orElse(null);
                
                // Fallback: If not found by ID, try to find by email (more stable)
                if (customer == null && request.getGuestEmail() != null && !request.getGuestEmail().trim().isEmpty()) {
                    customer = userRepository.findByEmail(request.getGuestEmail())
                            .orElse(null);
                }
                
                if (customer != null) {
                    booking.setCustomer(customer);
                    log.info("Creating booking for customer: {}", customer.getUsername());
                } else {
                    booking.setCustomer(null);
                    log.warn("Customer ID '{}' and email '{}' not found - treating as walk-in guest: {}", 
                            request.getCustomerId(), request.getGuestEmail(), request.getGuestFullName());
                }
            } catch (Exception e) {
                log.error("Error finding customer with ID '{}': {}", 
                        request.getCustomerId(), e.getMessage(), e);
                booking.setCustomer(null);
            }
        } else {
            booking.setCustomer(null);
            log.info("Creating booking for walk-in guest: {}", request.getGuestFullName());
        }
        
        // Always set guest information (from form in step 3)
        // This is useful even for logged-in customers (e.g., booking for someone else, contact backup)
        booking.setGuestFullName(request.getGuestFullName());
        booking.setGuestEmail(request.getGuestEmail());
        booking.setGuestPhone(request.getGuestPhone());
        log.info("Guest info set - Name: {}, Email: {}, Phone: {}", 
                request.getGuestFullName(), request.getGuestEmail(), request.getGuestPhone());
        
        // Generate booking code
        String bookingCode = generateBookingCode();
        while (bookingRepository.existsByBookingCode(bookingCode)) {
            bookingCode = generateBookingCode();
        }
        booking.setBookingCode(bookingCode);
        
        // Calculate prices
        BigDecimal roomsSubtotal = BigDecimal.ZERO;
        BigDecimal servicesTotal = BigDecimal.ZERO;
        
        for (CheckoutRequest.RoomBookingRequest roomReq : request.getRooms()) {
            BigDecimal roomPrice = BigDecimal.valueOf(roomReq.getPricePerNight());
            BigDecimal roomTotal = roomPrice.multiply(BigDecimal.valueOf(request.getNights()));
            roomsSubtotal = roomsSubtotal.add(roomTotal);
        }
        
        if (request.getServices() != null) {
            for (CheckoutRequest.ServiceBookingRequest serviceReq : request.getServices()) {
                BigDecimal servicePrice = BigDecimal.valueOf(serviceReq.getPrice());
                BigDecimal serviceTotal = servicePrice.multiply(BigDecimal.valueOf(serviceReq.getQuantity()));
                servicesTotal = servicesTotal.add(serviceTotal);
            }
        }
        
        booking.setSubtotalPrice(roomsSubtotal);
        booking.setTotalPrice(roomsSubtotal.add(servicesTotal));
        booking.setDiscountAmount(BigDecimal.ZERO);
        
        // Set payment status based on payment method
        if ("cash".equals(request.getPaymentMethod())) {
            // Cash payment - mark as PAID and CONFIRMED
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            log.info("Cash payment confirmed - setting payment status to PAID and booking to CONFIRMED");
        } else if ("vnpay".equals(request.getPaymentMethod())) {
            // VNPay - keep PENDING payment status, booking already CONFIRMED for payment creation
            // Will be updated to PAID after VNPay IPN callback confirms payment
            booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
            log.info("VNPay payment - keeping payment status PENDING, booking is CONFIRMED for payment gateway");
        } else {
            // Other online payments - similar to VNPay
            booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
            log.info("Online payment - keeping payment status PENDING");
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created: {} with code: {}", savedBooking.getId(), savedBooking.getBookingCode());
        
        // 2. Create BookingRooms
        for (CheckoutRequest.RoomBookingRequest roomReq : request.getRooms()) {
            Room room = roomRepository.findById(roomReq.getRoomId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
            
            BigDecimal pricePerNight = BigDecimal.valueOf(roomReq.getPricePerNight());
            BigDecimal totalAmount = pricePerNight.multiply(BigDecimal.valueOf(request.getNights()));
            
            BookingRoom bookingRoom = BookingRoom.builder()
                    .booking(savedBooking)
                    .room(room)
                    .pricePerNight(pricePerNight)
                    .nights(request.getNights())
                    .actualAdults(request.getGuests())
                    .actualChildren(0)
                    .totalAmount(totalAmount)
                    .roomNotes(roomReq.getRoomNotes())
                    .build();
            
            bookingRoomRepository.save(bookingRoom);
            log.info("BookingRoom created for room: {}", room.getRoomNumber());
        }
        
        // 3. Create ServiceBookings (only if customer exists)
        if (request.getServices() != null && !request.getServices().isEmpty() && booking.getCustomer() != null) {
            for (CheckoutRequest.ServiceBookingRequest serviceReq : request.getServices()) {
                Service service = serviceRepository.findById(serviceReq.getServiceId())
                        .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
                
                BigDecimal pricePerUnit = BigDecimal.valueOf(serviceReq.getPrice());
                BigDecimal totalPrice = pricePerUnit.multiply(BigDecimal.valueOf(serviceReq.getQuantity()));
                
                // Use check-in date as service date time (can be adjusted later)
                LocalDateTime serviceDateTime = request.getCheckIn().atStartOfDay();
                
                ServiceBooking serviceBooking = ServiceBooking.builder()
                        .booking(savedBooking)
                        .service(service)
                        .customer(booking.getCustomer())
                        .serviceDateTime(serviceDateTime)
                        .quantity(serviceReq.getQuantity())
                        .pricePerUnit(pricePerUnit)
                        .totalPrice(totalPrice)
                        .status(ServiceBooking.ServiceBookingStatus.PENDING)
                        .build();
                
                serviceBookingRepository.save(serviceBooking);
                log.info("ServiceBooking created for service: {} (quantity: {})", 
                        service.getName(), serviceReq.getQuantity());
            }
        } else if (request.getServices() != null && !request.getServices().isEmpty() && booking.getCustomer() == null) {
            log.warn("Services requested but no customer - skipping service bookings for walk-in guest");
        }
        
        log.info("Checkout completed successfully. Booking ID: {}, Code: {}", 
                savedBooking.getId(), savedBooking.getBookingCode());
        
        // Ensure customer is loaded before mapping (lazy loading issue)
        bookingRepository.flush();
        
        // Force load customer if it exists (to avoid lazy loading issues)
        if (savedBooking.getCustomer() != null) {
            // Access customer to trigger lazy load
            savedBooking.getCustomer().getUsername();
        }
        
        // Send booking confirmation email for cash payments
        if ("cash".equals(request.getPaymentMethod())) {
            try {
                emailService.sendBookingConfirmation(savedBooking);
                log.info("Booking confirmation email queued for cash payment: {}", savedBooking.getBookingCode());
            } catch (Exception e) {
                log.error("Failed to send booking confirmation email for: {}", 
                    savedBooking.getBookingCode(), e);
                // Don't fail the booking if email fails
            }
        }
        
        return bookingMapper.toBookingResponse(savedBooking);
    }
}

package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
}

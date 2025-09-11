package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.BookingResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Hotel;
import com.aurora.backend.entity.User;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.BookingMapper;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.HotelRepository;
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
public class BookingServiceImpl implements BookingService {
    
    BookingRepository bookingRepository;
    HotelRepository hotelRepository;
    UserRepository userRepository;
    BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreationRequest request) {
        log.info("Creating booking for hotel: {} and customer: {}", request.getHotelId(), request.getCustomerId());
        
        // Validate hotel exists
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        
        // Validate customer exists
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        Booking booking = bookingMapper.toBooking(request);
        booking.setHotel(hotel);
        booking.setCustomer(customer);
        
        // Generate unique booking code
        String bookingCode = generateBookingCode();
        while (bookingRepository.existsByBookingCode(bookingCode)) {
            bookingCode = generateBookingCode();
        }
        booking.setBookingCode(bookingCode);
        
        // Set default status if not provided
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            booking.setStatus("PENDING");
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
        
        // Check if booking can be deleted (no active rooms/services)
        
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
    public Page<BookingResponse> getBookingsByHotel(String hotelId, Pageable pageable) {
        log.debug("Fetching bookings for hotel ID: {} with pagination: {}", hotelId, pageable);
        
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        
        Page<Booking> bookings = bookingRepository.findByHotel(hotel, pageable);
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
    public Page<BookingResponse> searchBookings(String hotelId, String customerId, String status, Pageable pageable) {
        log.debug("Searching bookings with filters - Hotel: {}, Customer: {}, Status: {}", hotelId, customerId, status);
        
        Hotel hotel = null;
        User customer = null;
        
        if (hotelId != null && !hotelId.trim().isEmpty()) {
            hotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        }
        
        if (customerId != null && !customerId.trim().isEmpty()) {
            customer = userRepository.findById(customerId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }
        
        Page<Booking> bookings = bookingRepository.findByFilters(hotel, customer, status, pageable);
        return bookings.map(bookingMapper::toBookingResponse);
    }
    
    private String generateBookingCode() {
        return "BK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}

package com.aurora.backend.service;

import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponse createBooking(BookingCreationRequest request);
    BookingResponse updateBooking(String id, BookingUpdateRequest request);
    void deleteBooking(String id);
    BookingResponse getBookingById(String id);
    Page<BookingResponse> getAllBookings(Pageable pageable);
    Page<BookingResponse> getBookingsByBranch(String branchId, Pageable pageable);
    Page<BookingResponse> getBookingsByCustomer(String customerId, Pageable pageable);
    Page<BookingResponse> searchBookings(String branchId, String customerId, String status, Pageable pageable);
}

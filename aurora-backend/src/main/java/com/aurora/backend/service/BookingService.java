package com.aurora.backend.service;

import com.aurora.backend.dto.request.BookingCancellationRequest;
import com.aurora.backend.dto.request.BookingConfirmRequest;
import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingModificationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.BookingCancellationResponse;
import com.aurora.backend.dto.response.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponse createBooking(BookingCreationRequest request);
    BookingResponse updateBooking(String id, BookingUpdateRequest request);
    void deleteBooking(String id);
    BookingResponse getBookingById(String id);
    BookingResponse getBookingByCode(String code);
    Page<BookingResponse> getAllBookings(Pageable pageable);
    Page<BookingResponse> getBookingsByBranch(String branchId, Pageable pageable);
    Page<BookingResponse> getBookingsByCustomer(String customerId, Pageable pageable);
    Page<BookingResponse> searchBookings(String branchId, String customerId, String status, Pageable pageable);
    BookingResponse confirmBooking(BookingConfirmRequest request);
    BookingResponse modifyBooking(BookingModificationRequest request);
    BookingCancellationResponse cancelBooking(BookingCancellationRequest request);
    BookingResponse checkInBooking(String bookingId, String checkedInBy);
    BookingResponse checkOutBooking(String bookingId, String checkedOutBy);
    BookingResponse markNoShow(String bookingId, String reason);
    void autoConfirmAfterPayment(String bookingId);
    BookingResponse checkoutComplete(com.aurora.backend.dto.request.CheckoutRequest request);
}

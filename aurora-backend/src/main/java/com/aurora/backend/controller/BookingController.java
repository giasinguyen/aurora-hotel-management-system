package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.BookingCancellationRequest;
import com.aurora.backend.dto.request.BookingConfirmRequest;
import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingModificationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.BookingCancellationResponse;
import com.aurora.backend.dto.response.BookingResponse;
import com.aurora.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingController {
    
    BookingService bookingService;

    @PostMapping
    @RequirePermission(PermissionConstants.Customer.BOOKING_CREATE)
    public ApiResponse<BookingResponse> createBooking(@Valid @RequestBody BookingCreationRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Booking created successfully")
                .result(response)
                .build();
    }

    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.BOOKING_UPDATE_OWN)
    public ApiResponse<BookingResponse> updateBooking(@PathVariable String id, @Valid @RequestBody BookingUpdateRequest request) {
        BookingResponse response = bookingService.updateBooking(id, request);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.BOOKING_CANCEL_OWN)
    public ApiResponse<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Booking deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.BOOKING_VIEW_OWN)
    public ApiResponse<BookingResponse> getBookingById(@PathVariable String id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
    @RequirePermission(PermissionConstants.Staff.BOOKING_VIEW_ALL)
    public ApiResponse<Page<BookingResponse>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "checkin") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<BookingResponse> response = bookingService.getAllBookings(pageable);
        return ApiResponse.<Page<BookingResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Bookings retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/search")
    @RequirePermission(PermissionConstants.Staff.BOOKING_VIEW_ALL)
    public ApiResponse<Page<BookingResponse>> searchBookings(
            @RequestParam(required = false) String hotelId,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "checkin") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<BookingResponse> response = bookingService.searchBookings(hotelId, customerId, status, pageable);
        return ApiResponse.<Page<BookingResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Bookings searched successfully")
                .result(response)
                .build();
    }
    
    @PostMapping("/{id}/confirm")
    @RequirePermission(PermissionConstants.Staff.BOOKING_CONFIRM)
    public ApiResponse<BookingResponse> confirmBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingConfirmRequest request) {
        request.setBookingId(id);
        BookingResponse response = bookingService.confirmBooking(request);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking confirmed successfully")
                .result(response)
                .build();
    }
    
    @PutMapping("/{id}/modify")
    @RequirePermission(PermissionConstants.Customer.BOOKING_UPDATE_OWN)
    public ApiResponse<BookingResponse> modifyBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingModificationRequest request) {
        request.setBookingId(id);
        BookingResponse response = bookingService.modifyBooking(request);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking modified successfully")
                .result(response)
                .build();
    }
    
    @PostMapping("/{id}/cancel")
    @RequirePermission(PermissionConstants.Customer.BOOKING_CANCEL_OWN)
    public ApiResponse<BookingCancellationResponse> cancelBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingCancellationRequest request) {
        request.setBookingId(id);
        BookingCancellationResponse response = bookingService.cancelBooking(request);
        return ApiResponse.<BookingCancellationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking cancelled successfully")
                .result(response)
                .build();
    }
    
    @PostMapping("/{id}/check-in")
    @RequirePermission(PermissionConstants.Staff.BOOKING_CHECKIN)
    public ApiResponse<BookingResponse> checkInBooking(
            @PathVariable String id,
            @RequestParam String checkedInBy) {
        BookingResponse response = bookingService.checkInBooking(id, checkedInBy);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking checked in successfully")
                .result(response)
                .build();
    }
    
    @PostMapping("/{id}/check-out")
    @RequirePermission(PermissionConstants.Staff.BOOKING_CHECKOUT)
    public ApiResponse<BookingResponse> checkOutBooking(
            @PathVariable String id,
            @RequestParam String checkedOutBy) {
        BookingResponse response = bookingService.checkOutBooking(id, checkedOutBy);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking checked out successfully")
                .result(response)
                .build();
    }

    @PostMapping("/{id}/no-show")
    @RequirePermission(PermissionConstants.Staff.BOOKING_MANAGE)
    public ApiResponse<BookingResponse> markNoShow(
            @PathVariable String id,
            @RequestParam String reason) {
        BookingResponse response = bookingService.markNoShow(id, reason);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking marked as no-show")
                .result(response)
                .build();
    }
}

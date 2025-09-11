package com.aurora.backend.controller;

import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
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
@RequestMapping("/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingController {
    
    BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(@Valid @RequestBody BookingCreationRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Booking created successfully")
                .result(response)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BookingResponse> updateBooking(@PathVariable String id, @Valid @RequestBody BookingUpdateRequest request) {
        BookingResponse response = bookingService.updateBooking(id, request);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Booking deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getBookingById(@PathVariable String id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ApiResponse.<BookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Booking retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
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
}

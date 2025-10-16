package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.BookingRoomCreationRequest;
import com.aurora.backend.dto.request.BookingRoomUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.BookingRoomResponse;
import com.aurora.backend.service.BookingRoomService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking-rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingRoomController {
    
    BookingRoomService bookingRoomService;

    @PostMapping
    @RequirePermission(PermissionConstants.Customer.BOOKING_CREATE)
    public ApiResponse<BookingRoomResponse> createBookingRoom(@Valid @RequestBody BookingRoomCreationRequest request) {
        BookingRoomResponse result = bookingRoomService.createBookingRoom(request);
        return ApiResponse.<BookingRoomResponse>builder()
            .code(1000)
            .message("BookingRoom created successfully")
            .result(result)
            .build();
    }

    @GetMapping
    @RequirePermission(PermissionConstants.Staff.BOOKING_VIEW_ALL)
    public ApiResponse<Page<BookingRoomResponse>> getAllBookingRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookingRoomResponse> result = bookingRoomService.getAllBookingRooms(pageable);
        return ApiResponse.<Page<BookingRoomResponse>>builder()
            .code(1000)
            .message("BookingRooms retrieved successfully")
            .result(result)
            .build();
    }

    @GetMapping("/by-booking/{bookingId}")
    @RequirePermission(PermissionConstants.Customer.BOOKING_VIEW_OWN)
    public ApiResponse<Page<BookingRoomResponse>> getBookingRoomsByBooking(
            @PathVariable String bookingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookingRoomResponse> result = bookingRoomService.getBookingRoomsByBooking(bookingId, pageable);
        return ApiResponse.<Page<BookingRoomResponse>>builder()
            .code(1000)
            .message("BookingRooms by booking retrieved successfully")
            .result(result)
            .build();
    }

    @GetMapping("/by-room/{roomId}")
    @RequirePermission(PermissionConstants.Staff.BOOKING_VIEW_ALL)
    public ApiResponse<Page<BookingRoomResponse>> getBookingRoomsByRoom(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookingRoomResponse> result = bookingRoomService.getBookingRoomsByRoom(roomId, pageable);
        return ApiResponse.<Page<BookingRoomResponse>>builder()
            .code(1000)
            .message("BookingRooms by room retrieved successfully")
            .result(result)
            .build();
    }

    @GetMapping("/search")
    @RequirePermission(PermissionConstants.Staff.BOOKING_VIEW_ALL)
    public ApiResponse<Page<BookingRoomResponse>> searchBookingRooms(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookingRoomResponse> result = bookingRoomService.searchBookingRooms(bookingId, roomId, pageable);
        return ApiResponse.<Page<BookingRoomResponse>>builder()
            .code(1000)
            .message("BookingRooms search completed successfully")
            .result(result)
            .build();
    }

    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.BOOKING_VIEW_OWN)
    public ApiResponse<BookingRoomResponse> getBookingRoomById(@PathVariable String id) {
        BookingRoomResponse result = bookingRoomService.getBookingRoomById(id);
        return ApiResponse.<BookingRoomResponse>builder()
            .code(1000)
            .message("BookingRoom retrieved successfully")
            .result(result)
            .build();
    }

    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.BOOKING_UPDATE_OWN)
    public ApiResponse<BookingRoomResponse> updateBookingRoom(
            @PathVariable String id,
            @Valid @RequestBody BookingRoomUpdateRequest request) {
        
        BookingRoomResponse result = bookingRoomService.updateBookingRoom(id, request);
        return ApiResponse.<BookingRoomResponse>builder()
            .code(1000)
            .message("BookingRoom updated successfully")
            .result(result)
            .build();
    }

    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.BOOKING_CANCEL_OWN)
    public ApiResponse<Void> deleteBookingRoom(@PathVariable String id) {
        bookingRoomService.deleteBookingRoom(id);
        return ApiResponse.<Void>builder()
            .code(1000)
            .message("BookingRoom deleted successfully")
            .build();
    }
}

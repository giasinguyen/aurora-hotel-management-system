package com.aurora.backend.controller;

import com.aurora.backend.dto.request.ServiceBookingCreationRequest;
import com.aurora.backend.dto.request.ServiceBookingUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.ServiceBookingResponse;
import com.aurora.backend.service.ServiceBookingService;
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
@RequestMapping("/service-bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ServiceBookingController {
    
    ServiceBookingService serviceBookingService;

    @PostMapping
    public ApiResponse<ServiceBookingResponse> createServiceBooking(@Valid @RequestBody ServiceBookingCreationRequest request) {
        ServiceBookingResponse response = serviceBookingService.createServiceBooking(request);
        return ApiResponse.<ServiceBookingResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Service booking created successfully")
                .result(response)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ServiceBookingResponse> updateServiceBooking(@PathVariable String id, @Valid @RequestBody ServiceBookingUpdateRequest request) {
        ServiceBookingResponse response = serviceBookingService.updateServiceBooking(id, request);
        return ApiResponse.<ServiceBookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Service booking updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteServiceBooking(@PathVariable String id) {
        serviceBookingService.deleteServiceBooking(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Service booking deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ServiceBookingResponse> getServiceBookingById(@PathVariable String id) {
        ServiceBookingResponse response = serviceBookingService.getServiceBookingById(id);
        return ApiResponse.<ServiceBookingResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Service booking retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
    public ApiResponse<Page<ServiceBookingResponse>> getAllServiceBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ServiceBookingResponse> response = serviceBookingService.getAllServiceBookings(pageable);
        return ApiResponse.<Page<ServiceBookingResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Service bookings retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<ServiceBookingResponse>> searchServiceBookings(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String serviceId,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ServiceBookingResponse> response = serviceBookingService.searchServiceBookings(bookingId, serviceId, customerId, status, pageable);
        return ApiResponse.<Page<ServiceBookingResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Service bookings searched successfully")
                .result(response)
                .build();
    }
}

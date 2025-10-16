package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.PaymentCreationRequest;
import com.aurora.backend.dto.request.PaymentUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.PaymentResponse;
import com.aurora.backend.service.PaymentService;
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
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PaymentController {
    
    PaymentService paymentService;

    @PostMapping
    @RequirePermission(PermissionConstants.Customer.PAYMENT_CREATE)
    public ApiResponse<PaymentResponse> createPayment(@Valid @RequestBody PaymentCreationRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return ApiResponse.<PaymentResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Payment created successfully")
                .result(response)
                .build();
    }

    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Staff.PAYMENT_VIEW_ALL)
    public ApiResponse<PaymentResponse> updatePayment(@PathVariable String id, @Valid @RequestBody PaymentUpdateRequest request) {
        PaymentResponse response = paymentService.updatePayment(id, request);
        return ApiResponse.<PaymentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Payment updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Staff.PAYMENT_VIEW_ALL)
    public ApiResponse<Void> deletePayment(@PathVariable String id) {
        paymentService.deletePayment(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Payment deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Customer.PAYMENT_VIEW_OWN)
    public ApiResponse<PaymentResponse> getPaymentById(@PathVariable String id) {
        PaymentResponse response = paymentService.getPaymentById(id);
        return ApiResponse.<PaymentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Payment retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
    @RequirePermission(PermissionConstants.Staff.PAYMENT_VIEW_ALL)
    public ApiResponse<Page<PaymentResponse>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "paidAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PaymentResponse> response = paymentService.getAllPayments(pageable);
        return ApiResponse.<Page<PaymentResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Payments retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/search")
    @RequirePermission(PermissionConstants.Staff.PAYMENT_VIEW_ALL)
    public ApiResponse<Page<PaymentResponse>> searchPayments(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String method,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "paidAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PaymentResponse> response = paymentService.searchPayments(bookingId, method, status, pageable);
        return ApiResponse.<Page<PaymentResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Payments searched successfully")
                .result(response)
                .build();
    }
}

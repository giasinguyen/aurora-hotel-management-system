package com.aurora.backend.controller;

import com.aurora.backend.dto.request.VnPayPaymentRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.VnPayPaymentResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Booking.BookingStatus;
import com.aurora.backend.entity.Booking.PaymentStatus;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Payment;
import com.aurora.backend.entity.User;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.PaymentRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Test Controller for VNPay Integration Testing
 * 
 * ⚠️ WARNING: This controller is for TESTING ONLY
 * Remove or disable in production environment!
 * 
 * Purpose:
 * - Test VNPay payment flow without JWT authentication
 * - Create test bookings quickly
 * - Verify payment integration
 * 
 * Test Flow:
 * 1. POST /api/v1/test/vnpay/create-test-booking - Create a test booking
 * 2. POST /api/v1/test/vnpay/create-payment - Generate VNPay payment URL
 * 3. Go to VNPay sandbox and complete payment
 * 4. GET /api/v1/test/vnpay/check-status/{bookingId} - Check payment result
 * 5. DELETE /api/v1/test/vnpay/cleanup - Clean test data
 */
@RestController
@RequestMapping("/api/v1/test/vnpay")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Profile("dev")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VnPayTestController {
    
    VnPayService vnPayService;
    BookingRepository bookingRepository;
    PaymentRepository paymentRepository;
    BranchRepository branchRepository;
    UserRepository userRepository;
    
    /**
     * Test Endpoint 1: Create Test Booking
     * Tạo booking test với status CONFIRMED để có thể tạo payment
     * 
     * @return Booking info with ID to use for payment
     */
    @PostMapping("/create-test-booking")
    public ApiResponse<Map<String, Object>> createTestBooking(
            @RequestBody Map<String, Object> request) {
        
        log.info("Creating test booking for VNPay test...");
        
        // Extract parameters
        BigDecimal amount = new BigDecimal(request.getOrDefault("amount", "5000000").toString());
        
        // Get first branch and first user (or create dummy ones)
        Branch branch = branchRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No branch found in database. Please create at least one branch first."));
        
        User customer = userRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No user found in database. Please create at least one user first."));
        
        // Create a simple test booking
        Booking booking = Booking.builder()
                .bookingCode("TEST-" + System.currentTimeMillis())
                .branch(branch)
                .customer(customer)
                .totalPrice(amount)
                .status(BookingStatus.CONFIRMED) // CONFIRMED to allow payment
                .paymentStatus(PaymentStatus.PENDING)
                .checkin(LocalDate.now().plusDays(1)) // Tomorrow
                .checkout(LocalDate.now().plusDays(2)) // Day after tomorrow
                .build();
        
        booking = bookingRepository.save(booking);
        
        log.info("Created test booking: {} with amount: {}", booking.getBookingCode(), amount);
        
        Map<String, Object> result = new HashMap<>();
        result.put("bookingId", booking.getId());
        result.put("bookingCode", booking.getBookingCode());
        result.put("amount", amount);
        result.put("status", booking.getStatus());
        result.put("branchName", branch.getName());
        result.put("customerUsername", customer.getUsername());
        result.put("message", "Test booking created successfully. Use this booking ID to create payment.");
        
        return ApiResponse.<Map<String, Object>>builder()
                .code(HttpStatus.OK.value())
                .message("Test booking created successfully")
                .result(result)
                .build();
    }
    
    /**
     * Test Endpoint 2: Create Payment URL
     * Tạo payment URL cho test booking
     * 
     * @param request Payment request with bookingId
     * @param httpRequest HTTP request to get client IP
     * @return VNPay payment URL
     */
    @PostMapping("/create-payment")
    public ApiResponse<VnPayPaymentResponse> createTestPayment(
            @RequestBody VnPayPaymentRequest request,
            HttpServletRequest httpRequest) {
        
        log.info("Creating test payment for booking: {}", request.getBookingId());
        
        // Get client IP
        String clientIp = java.util.Optional.ofNullable(httpRequest.getHeader("X-Forwarded-For"))
                .map(ip -> ip.split(",")[0].trim())
                .orElse(httpRequest.getRemoteAddr());
        
        // Create payment URL using the real VnPayService
        VnPayPaymentResponse response = vnPayService.createPaymentUrl(
                request.getBookingId(),
                clientIp,
                request
        );
        
        log.info("Created test payment URL. TxnRef: {}", response.getTxnRef());
        log.info("Payment URL: {}", response.getPaymentUrl());
        
        return ApiResponse.<VnPayPaymentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Test payment URL created successfully")
                .result(response)
                .build();
    }
    
    /**
     * Test Endpoint 3: Check Payment Status
     * Kiểm tra trạng thái thanh toán của booking
     * 
     * @param bookingId Booking ID
     * @return Payment and booking status
     */
    @GetMapping("/check-status/{bookingId}")
    public ApiResponse<Map<String, Object>> checkPaymentStatus(@PathVariable String bookingId) {
        
        log.info("Checking payment status for booking: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        
        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        Payment payment = payments.isEmpty() ? null : payments.get(0);
        
        Map<String, Object> result = new HashMap<>();
        result.put("bookingId", booking.getId());
        result.put("bookingCode", booking.getBookingCode());
        result.put("bookingStatus", booking.getStatus());
        result.put("paymentStatus", booking.getPaymentStatus());
        result.put("totalPrice", booking.getTotalPrice());
        
        if (payment != null) {
            result.put("paymentExists", true);
            result.put("paymentId", payment.getId());
            result.put("paymentStatusFromPayment", payment.getStatus());
            result.put("paymentMethod", payment.getMethod());
            result.put("amount", payment.getAmount());
            result.put("providerTxnId", payment.getProviderTxnId());
        } else {
            result.put("paymentExists", false);
            result.put("message", "No payment found for this booking");
        }
        
        return ApiResponse.<Map<String, Object>>builder()
                .code(HttpStatus.OK.value())
                .message("Payment status retrieved successfully")
                .result(result)
                .build();
    }
    
    /**
     * Test Endpoint 4: List Test Bookings
     * Liệt kê tất cả các booking test (bookingCode bắt đầu với "TEST-")
     * 
     * @return List of test bookings
     */
    @GetMapping("/list-bookings")
    public ApiResponse<List<Map<String, Object>>> listTestBookings() {
        
        log.info("Listing all test bookings...");
        
        List<Booking> testBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingCode().startsWith("TEST-"))
                .toList();
        
        List<Map<String, Object>> result = testBookings.stream()
                .map(booking -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("bookingId", booking.getId());
                    map.put("bookingCode", booking.getBookingCode());
                    map.put("status", booking.getStatus());
                    map.put("paymentStatus", booking.getPaymentStatus());
                    map.put("totalPrice", booking.getTotalPrice());
                    map.put("checkin", booking.getCheckin());
                    map.put("checkout", booking.getCheckout());
                    
                    // Check if payment exists
                    List<Payment> payments = paymentRepository.findByBookingId(booking.getId());
                    if (!payments.isEmpty()) {
                        Payment payment = payments.get(0);
                        map.put("paymentStatusFromPayment", payment.getStatus());
                        map.put("paymentMethod", payment.getMethod());
                    }
                    
                    return map;
                })
                .toList();
        
        return ApiResponse.<List<Map<String, Object>>>builder()
                .code(HttpStatus.OK.value())
                .message("Test bookings retrieved successfully")
                .result(result)
                .build();
    }
    
    /**
     * Test Endpoint 5: Cleanup Test Data
     * Xóa tất cả test bookings và payments
     * 
     * ⚠️ WARNING: This will delete ALL test data!
     * 
     * @return Cleanup result
     */
    @DeleteMapping("/cleanup")
    public ApiResponse<Map<String, Object>> cleanupTestData() {
        
        log.info("Cleaning up test data...");
        
        // Find all test bookings
        List<Booking> testBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingCode().startsWith("TEST-"))
                .toList();
        
        int deletedBookings = 0;
        int deletedPayments = 0;
        
        for (Booking booking : testBookings) {
            // Delete payments first (foreign key constraint)
            List<Payment> payments = paymentRepository.findAll().stream()
                    .filter(p -> p.getBooking() != null && p.getBooking().getId().equals(booking.getId()))
                    .toList();
            
            deletedPayments += payments.size();
            paymentRepository.deleteAll(payments);
            
            // Then delete booking
            bookingRepository.delete(booking);
            deletedBookings++;
        }
        
        log.info("Deleted {} test bookings and {} payments", deletedBookings, deletedPayments);
        
        Map<String, Object> result = new HashMap<>();
        result.put("deletedBookings", deletedBookings);
        result.put("deletedPayments", deletedPayments);
        result.put("message", "Test data cleaned up successfully");
        
        return ApiResponse.<Map<String, Object>>builder()
                .code(HttpStatus.OK.value())
                .message("Test data cleaned up successfully")
                .result(result)
                .build();
    }
    
    /**
     * Test Endpoint 6: Health Check
     * Kiểm tra xem test controller có hoạt động không
     * 
     * @return Health status
     */
    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "OK");
        result.put("message", "VNPay Test Controller is running");
        result.put("timestamp", LocalDate.now());
        
        return ApiResponse.<Map<String, Object>>builder()
                .code(HttpStatus.OK.value())
                .message("Health check successful")
                .result(result)
                .build();
    }
}

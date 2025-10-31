package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.VnPayPaymentRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.VnPayPaymentResponse;
import com.aurora.backend.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/payments/vnpay")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VnPayController {
    
    VnPayService vnPayService;
    
    /**
     * Tạo URL thanh toán VNPay
     * Endpoint: POST /api/v1/payments/vnpay/create
     * 
     * Flow:
     * 1. Customer request payment URL từ frontend
     * 2. Backend validate booking và tạo payment record
     * 3. Backend tạo URL với signature
     * 4. Frontend redirect customer tới VNPay
     * 
     * @param request VNPay payment request
     * @param httpRequest HTTP request để lấy client IP
     * @return VNPay payment response với payment URL
     */
    @PostMapping("/create")
    @RequirePermission(PermissionConstants.Customer.PAYMENT_CREATE)
    public ApiResponse<VnPayPaymentResponse> createPaymentUrl(
            @Valid @RequestBody VnPayPaymentRequest request,
            HttpServletRequest httpRequest) {
        
        log.info("Received VNPay payment request for booking: {}", request.getBookingId());
        
        // Get client IP (support proxy)
        String clientIp = Optional.ofNullable(httpRequest.getHeader("X-Forwarded-For"))
            .map(ip -> ip.split(",")[0].trim())
            .orElse(httpRequest.getRemoteAddr());
        
        VnPayPaymentResponse response = vnPayService.createPaymentUrl(
            request.getBookingId(),
            clientIp,
            request
        );
        
        log.info("Created VNPay payment URL successfully. TxnRef: {}", response.getTxnRef());
        
        return ApiResponse.<VnPayPaymentResponse>builder()
            .code(HttpStatus.OK.value())
            .message("VNPay payment URL created successfully")
            .result(response)
            .build();
    }
    
    /**
     * Flow:
     * 1. Customer thanh toán tại VNPay
     * 2. VNPay gọi IPN (có thể gọi nhiều lần)
     * 3. Backend validate signature
     * 4. Backend update payment & booking status
     * 5. Return response code cho VNPay
     * 
     * Response Codes:
     * - 00: Success
     * - 97: Invalid signature
     * - 04: Invalid amount
     * 
     * @param params Parameters từ VNPay IPN
     * @return Response code và message cho VNPay
     */
    @PostMapping("/ipn")
    public Map<String, String> handleIpn(@RequestParam Map<String, String> params) {
        log.info("===== VNPay IPN Callback Received =====");
        log.info("TxnRef: {}, ResponseCode: {}, Amount: {}", 
            params.get("vnp_TxnRef"),
            params.get("vnp_ResponseCode"),
            params.get("vnp_Amount")
        );
        
        Map<String, String> response = vnPayService.handleIpnCallback(params);
        
        log.info("IPN Response: RspCode={}, Message={}", 
            response.get("RspCode"), 
            response.get("Message")
        );
        
        return response;
    }
    
    /**
     * Flow:
     * 1. VNPay redirect customer về frontend
     * 2. Frontend call API này để lấy payment result
     * 3. Frontend hiển thị kết quả cho customer
     * 
     * @param params Parameters từ VNPay return URL
     * @return Payment result information
     */
    @GetMapping("/return")
    public ApiResponse<Map<String, Object>> handleReturn(
            @RequestParam Map<String, String> params) {
        
        log.info("===== VNPay Return URL Received =====");
        log.info("TxnRef: {}, ResponseCode: {}", 
            params.get("vnp_TxnRef"),
            params.get("vnp_ResponseCode")
        );
        
        Map<String, Object> result = vnPayService.handleReturnUrl(params);
        
        return ApiResponse.<Map<String, Object>>builder()
            .code(HttpStatus.OK.value())
            .message("Payment result retrieved successfully")
            .result(result)
            .build();
    }
}

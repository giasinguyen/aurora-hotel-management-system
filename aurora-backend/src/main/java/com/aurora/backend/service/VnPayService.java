package com.aurora.backend.service;

import com.aurora.backend.dto.request.VnPayPaymentRequest;
import com.aurora.backend.dto.response.VnPayPaymentResponse;

import java.util.Map;

/**
 * Service for VNPay payment gateway integration
 */
public interface VnPayService {
    
    /**
     * Tạo URL thanh toán VNPay cho booking
     * 
     * @param bookingId ID của booking cần thanh toán
     * @param clientIp IP của customer (required by VNPay)
     * @param request VNPay payment request
     * @return VNPay payment response với payment URL
     */
    VnPayPaymentResponse createPaymentUrl(
        String bookingId, 
        String clientIp, 
        VnPayPaymentRequest request
    );
    
    /**
     * Xác thực chữ ký HMAC SHA512 từ VNPay
     * 
     * @param params Parameters từ VNPay callback
     * @return true nếu signature hợp lệ, false nếu không
     */
    boolean validateSignature(Map<String, String> params);
    
    /**
     * Xử lý IPN callback từ VNPay (server-to-server)
     * QUAN TRỌNG: Đây là endpoint chính để chốt đơn thanh toán
     * 
     * @param params Parameters từ VNPay IPN
     * @return Response code và message cho VNPay
     */
    Map<String, String> handleIpnCallback(Map<String, String> params);
    
    /**
     * Xử lý Return URL (user được redirect về sau khi thanh toán)
     * CHỈ để hiển thị kết quả, KHÔNG dùng để chốt đơn
     * 
     * @param params Parameters từ VNPay return URL
     * @return Payment result information
     */
    Map<String, Object> handleReturnUrl(Map<String, String> params);
}

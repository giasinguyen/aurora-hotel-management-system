package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnPayPaymentResponse {
    
    /**
     * URL thanh toán VNPay để redirect customer
     */
    String paymentUrl;
    
    /**
     * Payment ID trong hệ thống Aurora
     */
    String paymentId;
    
    /**
     * Mã tham chiếu giao dịch gửi tới VNPay (vnp_TxnRef)
     * Format: AURORA_YYYYMMDDHHMMSS_BOOKINGCODE
     */
    String txnRef;
    
    /**
     * Số tiền thanh toán (VNĐ)
     */
    BigDecimal amount;
    
    /**
     * Thời gian hết hạn thanh toán (15 phút)
     */
    LocalDateTime expireTime;
    
    /**
     * Booking code
     */
    String bookingCode;
}

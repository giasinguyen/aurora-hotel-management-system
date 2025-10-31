package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnPayPaymentRequest {
    
    @NotBlank(message = "Booking ID is required")
    String bookingId;
    
    /**
     * Mã ngân hàng (optional)
     * - VNPAYQR: Thanh toán qua QR Code
     * - VNBANK: Thẻ ATM nội địa
     * - INTCARD: Thẻ thanh toán quốc tế (Visa, Mastercard, JCB, etc.)
     * - NCB: Ngân hàng NCB
     * - Hoặc mã ngân hàng cụ thể khác
     */
    String bankCode;
    
    /**
     * Ngôn ngữ hiển thị trên trang VNPay
     * - "vn": Tiếng Việt
     * - "en": English
     */
    @Pattern(regexp = "vn|en", message = "Language must be 'vn' or 'en'")
    @Builder.Default
    String language = "vn";
}

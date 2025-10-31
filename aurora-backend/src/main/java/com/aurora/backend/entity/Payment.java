package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_booking", columnList = "booking_id"),
        @Index(name = "idx_payment_status", columnList = "status"),
        @Index(name = "idx_payment_method", columnList = "method"),
        @Index(name = "idx_payment_provider_txn", columnList = "providerTxnId")
})
public class Payment extends BaseEntity {

    @NotNull(message = "Booking is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    Booking booking;

    @NotNull(message = "Payment method is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    PaymentMethod method;
    
    @NotNull(message = "Payment status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    PaymentStatus status = PaymentStatus.PENDING;
    
    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    @Column(nullable = false, precision = 12, scale = 2)
    BigDecimal amount;
    
    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be 3 characters (ISO 4217)")
    @Column(length = 3)
    @Builder.Default
    String currency = "VND";

    @Column(length = 200)
    String providerTxnId;   // Mã giao dịch từ VNPay/MoMo/ZaloPay...
    
    @Column(length = 1000)  // Increased from 500, consider encryption
    String providerResponse; // Response từ payment gateway (should be encrypted for sensitive data)
    
    LocalDateTime paidAt;
    
    // Refund information
    @DecimalMin(value = "0.0", message = "Refund amount cannot be negative")
    @Column(precision = 12, scale = 2)
    BigDecimal refundAmount;
    
    LocalDateTime refundedAt;
    
    @Column(length = 500)
    String refundReason;
    
    @Column(length = 200)
    String refundTxnId; // Mã giao dịch hoàn tiền
    
    // Payment notes
    @Column(length = 1000)
    String notes;
    
    @Column(length = 100)
    String processedBy;
    
    // VNPay specific fields
    @Column(length = 100, unique = true)
    String vnpayTxnRef;      // Mã đơn hàng gửi tới VNPay (unique, format: AURORA_YYYYMMDDHHMMSS_BOOKINGCODE)
    
    @Column(length = 50)
    String vnpayResponseCode; // Response code từ VNPay (00 = success, other = error codes)
    
    @Column(length = 50)
    String vnpayBankCode;     // Mã ngân hàng (VNBANK, INTCARD, NCB, etc.)
    
    @Column(columnDefinition = "TEXT")
    String vnpaySecureHash;   // Secure hash từ VNPay (for audit and verification)
    
    @Column(length = 20)
    String vnpayCardType;     // Loại thẻ: ATM, CREDIT, etc.

    // Payment Method Enum
    public enum PaymentMethod {
        CASH,           // Tiền mặt
        CARD,           // Thẻ tín dụng/ghi nợ
        BANK_TRANSFER,  // Chuyển khoản ngân hàng
        VNPAY,          // VNPay
        MOMO,           // MoMo
        ZALOPAY,        // ZaloPay
        PAYPAL          // PayPal (cho khách quốc tế)
    }
    
    // Payment Status Enum
    public enum PaymentStatus {
        PENDING,        // Chờ thanh toán
        PROCESSING,     // Đang xử lý
        SUCCESS,        // Thành công
        FAILED,         // Thất bại
        REFUNDED,       // Đã hoàn tiền
        PARTIALLY_REFUNDED // Hoàn tiền một phần
    }
}

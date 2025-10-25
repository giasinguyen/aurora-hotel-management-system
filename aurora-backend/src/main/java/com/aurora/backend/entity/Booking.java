package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_code", columnList = "bookingCode"),
        @Index(name = "idx_booking_branch", columnList = "branch_id"),
        @Index(name = "idx_booking_customer", columnList = "customer_id"),
        @Index(name = "idx_booking_dates", columnList = "checkin,checkout"),
        @Index(name = "idx_booking_status", columnList = "status")
})
public class Booking extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    User customer;

    @Column(nullable = false)
    LocalDate checkin;
    
    @Column(nullable = false)
    LocalDate checkout;

    // Promotion tracking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applied_promotion_id")
    Promotion appliedPromotion; // Promotion đã áp dụng cho booking này
    
    @Column(precision = 10, scale = 2)
    BigDecimal discountAmount; // Số tiền được giảm từ promotion
    
    @Column(precision = 12, scale = 2)
    BigDecimal subtotalPrice; // Tổng tiền trước khi giảm giá

    @Column(precision = 12, scale = 2)
    BigDecimal totalPrice;   // Tổng tiền sau promo + services
    
    @Column(precision = 12, scale = 2)
    BigDecimal depositAmount; // Tiền đặt cọc
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    BookingStatus status = BookingStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(length = 1000)
    String specialRequest;
    
    LocalDateTime cancelledAt;
    
    @Column(length = 500)
    String cancellationReason;
    
    @Column(nullable = false)
    @Builder.Default
    Boolean emailSent = false;
    
    @Column(nullable = false)
    @Builder.Default
    Boolean smsSent = false;
    
    LocalDateTime actualCheckinTime;
    LocalDateTime actualCheckoutTime;
    
    @Column(length = 100)
    String checkedInBy;
    
    @Column(length = 100)
    String checkedOutBy;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<BookingRoom> rooms;

    public enum BookingStatus {
        PENDING,        // Chờ xác nhận
        CONFIRMED,      // Đã xác nhận
        CHECKED_IN,     // Đã check-in
        CHECKED_OUT,    // Đã check-out
        COMPLETED,      // Hoàn thành
        CANCELLED,      // Đã hủy
        NO_SHOW         // Không đến
    }
    
    public enum PaymentStatus {
        PENDING,        // Chờ thanh toán
        DEPOSIT_PAID,   // Đã đặt cọc
        PARTIALLY_PAID, // Thanh toán một phần
        PAID,           // Đã thanh toán đủ
        REFUNDED        // Đã hoàn tiền
    }
}

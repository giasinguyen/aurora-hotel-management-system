package com.aurora.backend.entity;

import jakarta.persistence.*;
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
@Table(name = "service_bookings", indexes = {
        @Index(name = "idx_service_booking_booking", columnList = "booking_id"),
        @Index(name = "idx_service_booking_service", columnList = "service_id"),
        @Index(name = "idx_service_booking_customer", columnList = "customer_id"),
        @Index(name = "idx_service_booking_status", columnList = "status"),
        @Index(name = "idx_service_booking_datetime", columnList = "serviceDateTime")
})
public class ServiceBooking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    Booking booking; // Có thể null nếu book service riêng lẻ

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    Service service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    User customer;

    @Column(nullable = false)
    LocalDateTime serviceDateTime; // Thời gian sử dụng dịch vụ
    
    @Column(nullable = false)
    Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal pricePerUnit;   // Snapshot giá tại thời điểm đặt
    
    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal totalPrice;     // quantity * pricePerUnit
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    ServiceBookingStatus status = ServiceBookingStatus.PENDING;
    
    // Special instructions
    @Column(length = 1000)
    String specialInstructions;
    
    // Completion information
    LocalDateTime completedAt;
    
    @Column(length = 100)
    String completedBy;
    
    @Column(length = 500)
    String completionNotes;
    
    // Cancellation information
    LocalDateTime cancelledAt;
    
    @Column(length = 500)
    String cancellationReason;
    
    // Service Booking Status Enum
    public enum ServiceBookingStatus {
        PENDING,        // Chờ xác nhận
        CONFIRMED,      // Đã xác nhận
        IN_PROGRESS,    // Đang thực hiện
        COMPLETED,      // Đã hoàn thành
        CANCELLED,      // Đã hủy
        NO_SHOW         // Không đến
    }
}

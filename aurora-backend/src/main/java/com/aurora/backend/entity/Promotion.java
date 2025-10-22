package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "promotions", indexes = {
        @Index(name = "idx_promotion_code", columnList = "code"),
        @Index(name = "idx_promotion_dates", columnList = "startAt,endAt"),
        @Index(name = "idx_promotion_active", columnList = "active")
})
public class Promotion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    Branch branch; // Null = áp dụng cho tất cả chi nhánh

    @NotBlank(message = "Promotion code is required")
    @Size(min = 3, max = 50, message = "Code must be between 3 and 50 characters")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Code must contain only uppercase letters, numbers, and underscores")
    @Column(nullable = false, unique = true, length = 50)
    String code; // EARLY10, SUMMER2025, WEEKEND50...
    
    @NotBlank(message = "Promotion name is required")
    @Column(nullable = false, length = 200)
    String name;
    
    @NotNull(message = "Start date is required")
    @Column(nullable = false)
    LocalDate startAt;
    
    @NotNull(message = "End date is required")
    @Column(nullable = false)
    LocalDate endAt;
    
    @Column(nullable = false)
    @Builder.Default
    Boolean active = true;

    // Discount type
    @NotNull(message = "Discount type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    DiscountType discountType = DiscountType.PERCENTAGE;
    
    @DecimalMin(value = "0.0", message = "Percent off must be at least 0")
    @DecimalMax(value = "100.0", message = "Percent off cannot exceed 100")
    @Column(precision = 5, scale = 2)
    BigDecimal percentOff;  // % giảm giá (0-100)
    
    @DecimalMin(value = "0.0", message = "Amount off must be positive")
    @Column(precision = 10, scale = 2)
    BigDecimal amountOff;   // Số tiền giảm cố định
    
    // Conditions
    @DecimalMin(value = "0.0", message = "Minimum booking amount must be positive")
    @Column(precision = 10, scale = 2)
    BigDecimal minBookingAmount; // Giá trị đơn hàng tối thiểu
    
    @Min(value = 1, message = "Minimum nights must be at least 1")
    Integer minNights; // Số đêm tối thiểu
    
    @Min(value = 1, message = "Usage limit must be at least 1")
    Integer usageLimit; // Giới hạn số lần sử dụng (null = unlimited)
    
    @Min(value = 0, message = "Used count cannot be negative")
    @Column(nullable = false)
    @Builder.Default
    Integer usedCount = 0; // Số lần đã sử dụng (should be calculated from bookings)
    
    @DecimalMin(value = "0.0", message = "Max discount amount must be positive")
    @Column(precision = 10, scale = 2)
    BigDecimal maxDiscountAmount; // Giảm tối đa (cho trường hợp %)
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promotion_room_types",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "room_type_id")
    )
    Set<RoomType> applicableRoomTypes; // Null hoặc empty = tất cả loại phòng
    
    // Stacking rules
    @Column(nullable = false)
    @Builder.Default
    Boolean stackable = false; // Có thể kết hợp với promotion khác không
    
    @Column(nullable = false)
    @Builder.Default
    Boolean exclusiveWithOthers = false; // Không thể dùng cùng promotion khác
    
    // Description
    @Column(length = 1000)
    String description;
    
    @Column(length = 2000)
    String termsAndConditions; // Điều khoản và điều kiện
    
    // Priority (higher number = higher priority)
    @Column(nullable = false)
    @Builder.Default
    Integer priority = 0;
    
    @Column(length = 100)
    String createdBy; // Username của người tạo

    // Discount Type Enum
    public enum DiscountType {
        PERCENTAGE,     // Giảm theo %
        FIXED_AMOUNT    // Giảm số tiền cố định
    }
}

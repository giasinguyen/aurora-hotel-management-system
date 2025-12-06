package com.aurora.backend.entity;

import com.aurora.backend.converter.StringListConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "rooms", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"branch_id", "roomNumber"}),
       indexes = {
           @Index(name = "idx_room_status", columnList = "status"),
           @Index(name = "idx_room_branch", columnList = "branch_id"),
           @Index(name = "idx_room_type", columnList = "room_type_id")
       })
public class Room extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id")
    RoomType roomType;

    @Column(nullable = false, length = 20)
    String roomNumber;
    
    Integer floor;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    RoomStatus status = RoomStatus.AVAILABLE;
    
    @Column(length = 50)
    String viewType; // CITY, SEA, MOUNTAIN, GARDEN
    
    // Price management - Dynamic pricing with sale support
    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    BigDecimal basePrice; // Giá gốc của phòng (có thể thay đổi qua cron job)
    
    @DecimalMin(value = "0.0", message = "Sale percent cannot be negative")
    @DecimalMax(value = "100.0", message = "Sale percent cannot exceed 100")
    @Column(name = "sale_percent", precision = 5, scale = 2)
    @Builder.Default
    BigDecimal salePercent = BigDecimal.ZERO; // % giảm giá (0-100), hệ thống tự tính giá hiển thị
    
    // Calculated display price (not stored, calculated dynamically)
    // displayPrice = basePrice * (100 - salePercent) / 100
    
    @Column(length = 1000)
    String maintenanceNotes;
    
    LocalDateTime lastCleaned;
    
    // Images - lưu dưới dạng JSON array trong column
    @Convert(converter = StringListConverter.class)
    @Column(name = "images", columnDefinition = "TEXT")
    @Builder.Default
    List<String> images = new ArrayList<>(); // Danh sách ảnh của phòng cụ thể

    // Room Status Enum
    public enum RoomStatus {
        AVAILABLE,      // Phòng trống, sẵn sàng đặt
        OCCUPIED,       // Đang có khách
        CLEANING,       // Đang dọn dẹp
        MAINTENANCE,    // Đang bảo trì
        OUT_OF_ORDER,   // Hỏng hóc, không sử dụng được
        RESERVED        // Đã được đặt nhưng chưa check-in
    }
}

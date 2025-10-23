package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "services", indexes = {
        @Index(name = "idx_service_branch", columnList = "branch_id"),
        @Index(name = "idx_service_type", columnList = "type"),
        @Index(name = "idx_service_active", columnList = "active")
})
public class Service extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Column(nullable = false, length = 200)
    String name; // Spa, Massage, Airport Pickup, Laundry...
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    ServiceType type;
    
    @Column(length = 2000)
    String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal basePrice;
    
    @Column(length = 50)
    String unit; // "per hour", "per person", "per item", "per trip"
    
    // Duration (in minutes)
    Integer durationMinutes;
    
    // Capacity/Availability
    Integer maxCapacityPerSlot; // Số lượng khách tối đa mỗi slot thời gian
    
    @Column(nullable = false)
    @Builder.Default
    Boolean requiresBooking = true; // Có cần đặt trước không
    
    @Column(nullable = false)
    @Builder.Default
    Boolean active = true; // Dịch vụ có đang hoạt động không
    
    // Images
    @ElementCollection
    @CollectionTable(name = "service_images", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "image_url", length = 500)
    List<String> imageUrls;
    
    // Operating hours (if different from branch)
    @Column(length = 100)
    String operatingHours; // "08:00-22:00" or "24/7"
    
    // Service Type Enum
    public enum ServiceType {
        SPA,            // Spa services
        MASSAGE,        // Massage
        RESTAURANT,     // Nhà hàng
        ROOM_SERVICE,   // Dịch vụ phòng
        LAUNDRY,        // Giặt ủi
        AIRPORT_TRANSFER, // Đưa đón sân bay
        TOUR,           // Tour du lịch
        GYM,            // Phòng gym
        CONFERENCE,     // Hội nghị
        OTHER           // Khác
    }
}

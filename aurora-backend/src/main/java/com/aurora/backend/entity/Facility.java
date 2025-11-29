package com.aurora.backend.entity;

import com.aurora.backend.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "facilities", indexes = {
        @Index(name = "idx_facility_branch", columnList = "branch_id"),
        @Index(name = "idx_facility_type", columnList = "type"),
        @Index(name = "idx_facility_active", columnList = "active")
})
public class Facility extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Column(nullable = false, length = 200)
    String name;   // Swimming Pool, Spa, Gym, Restaurant...
    
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    FacilityType type;
    
    @Column(length = 2000)
    String description;
    
    @Column(length = 100)
    String location; // Vị trí trong khách sạn: "Floor 1", "Rooftop", "Garden"
    
    @Column(length = 100)
    String openingHours;    // "06:00-22:00" or "24/7"
    
    @Column(length = 1000)
    String policies; // Chính sách sử dụng
    
    @Column(nullable = false)
    @Builder.Default
    Boolean requiresReservation = false; // Có cần đặt trước không
    
    @Column(nullable = false)
    @Builder.Default
    Boolean active = true;
    
    Integer capacity; // Sức chứa (nếu có)
    
    @Column(nullable = false)
    @Builder.Default
    Boolean freeForGuests = true; // Miễn phí cho khách lưu trú
    
    // Images - lưu dưới dạng JSON array trong column
    @Convert(converter = StringListConverter.class)
    @Column(name = "images", columnDefinition = "TEXT")
    @Builder.Default
    List<String> images = new ArrayList<>();
    
    // Facility Type Enum
    public enum FacilityType {
        POOL,               // Hồ bơi
        SPA,                // Spa
        GYM,                // Phòng gym
        RESTAURANT,         // Nhà hàng
        BAR,                // Quầy bar
        CONFERENCE_ROOM,    // Phòng hội nghị
        BUSINESS_CENTER,    // Trung tâm kinh doanh
        PARKING,            // Bãi đậu xe
        GARDEN,             // Vườn
        KIDS_CLUB,          // Câu lạc bộ trẻ em
        LIBRARY,            // Thư viện
        OTHER               // Khác
    }
}

package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "amenities", indexes = {
        @Index(name = "idx_amenity_name", columnList = "name"),
        @Index(name = "idx_amenity_type", columnList = "type")
})
public class Amenity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    String name; // TV, Minibar, WiFi, Air Conditioner...
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    AmenityType type = AmenityType.ROOM_DEFAULT;
    
    @Column(length = 500)
    String description;
    
    @Column(length = 200)
    String icon; // Icon class or URL
    
    @Column(nullable = false)
    @Builder.Default
    Boolean active = true;
    
    @Column(nullable = false)
    @Builder.Default
    Integer displayOrder = 0;
    
    public enum AmenityType {
        ROOM_DEFAULT,       // Tiện nghi cơ bản trong phòng
        ROOM_PREMIUM,       // Tiện nghi cao cấp
        BATHROOM,           // Tiện nghi phòng tắm
        ENTERTAINMENT,      // Giải trí
        TECHNOLOGY,         // Công nghệ
        COMFORT,            // Tiện nghi thoải mái
        SAFETY,             // An toàn
        ACCESSIBILITY       // Tiện nghi cho người khuyết tật
    }
}

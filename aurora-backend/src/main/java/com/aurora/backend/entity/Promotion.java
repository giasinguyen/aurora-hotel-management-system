package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    Hotel hotel;

    @Column(nullable = false, unique = true)
    String code; // EARLY10...
    String name;
    LocalDate startAt;
    LocalDate endAt;
    Boolean active;

    Double percentOff;  // hoặc amountOff
    String conditions;  // mô tả ngắn (có thể tách bảng điều kiện nếu cần)
}

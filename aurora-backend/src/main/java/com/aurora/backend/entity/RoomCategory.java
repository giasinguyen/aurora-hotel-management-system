package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.Set;

/**
 * Room Category Entity - Hạng phòng (Standard, Deluxe, Presidential Suite)
 * Đây là cấp cao nhất trong phân cấp phòng
 */
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "room_categories",
       uniqueConstraints = @UniqueConstraint(columnNames = {"branch_id", "code"}),
       indexes = {
           @Index(name = "idx_category_branch", columnList = "branch_id"),
           @Index(name = "idx_category_code", columnList = "code")
       })
public class RoomCategory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    String name;   // Standard Room, Deluxe Room, Presidential Suite

    @NotBlank(message = "Category code is required")
    @Column(nullable = false, length = 20)
    String code;   // STD, DLX, PRE

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    String description;

    @Column(name = "display_order")
    Integer displayOrder;  // Thứ tự hiển thị

    @Column(nullable = false)
    @Builder.Default
    Boolean active = true;

    @Column(length = 500)
    String imageUrl;  // Ảnh đại diện cho category

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    Set<RoomType> roomTypes;
}


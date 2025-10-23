package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "room_types",
       uniqueConstraints = @UniqueConstraint(columnNames = {"branch_id", "code"}),
       indexes = {
           @Index(name = "idx_roomtype_branch", columnList = "branch_id"),
           @Index(name = "idx_roomtype_code", columnList = "code")
       })
public class RoomType extends BaseEntity {

    @NotNull(message = "Branch is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @NotBlank(message = "Room type name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    String name;   // Deluxe, Suite, Standard, Premium...
    
    @NotBlank(message = "Room type code is required")
    @Pattern(regexp = "^[A-Z]{3,5}$", message = "Code must be 3-5 uppercase letters")
    @Column(length = 20)
    String code;   // DEL, STE, STD, PRM
    
    // CRITICAL: Price information
    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal basePrice; // Giá cơ bản trong tuần
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Weekend price must be greater than 0")
    @Column(precision = 10, scale = 2)
    BigDecimal weekendPrice; // Giá cuối tuần (optional, nếu null thì dùng basePrice)
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Holiday price must be greater than 0")
    @Column(precision = 10, scale = 2)
    BigDecimal holidayPrice; // Giá ngày lễ (optional)
    
    // Capacity information
    @NotNull(message = "Adult capacity is required")
    @Min(value = 1, message = "Adult capacity must be at least 1")
    @Column(nullable = false)
    Integer capacityAdults;
    
    @Min(value = 0, message = "Children capacity cannot be negative")
    Integer capacityChildren;
    
    @NotNull(message = "Max occupancy is required")
    @Min(value = 1, message = "Max occupancy must be at least 1")
    @Column(nullable = false)
    Integer maxOccupancy; // Tổng số người tối đa
    
    // Room specifications
    @DecimalMin(value = "0.0", inclusive = false, message = "Size must be greater than 0")
    Double sizeM2;
    
    @Column(length = 50)
    String bedType; // SINGLE, DOUBLE, TWIN, KING, QUEEN
    
    @Min(value = 1, message = "Number of beds must be at least 1")
    Integer numberOfBeds;
    
    // Policies
    @Column(nullable = false)
    @Builder.Default
    Boolean refundable = true;
    
    @Column(nullable = false)
    @Builder.Default
    Boolean smokingAllowed = false;
    
    // Description
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Column(length = 2000)
    String description;
    
    @Size(max = 500, message = "Short description cannot exceed 500 characters")
    @Column(length = 500)
    String shortDescription;
    
    // Images
    @ElementCollection
    @CollectionTable(name = "room_type_images", joinColumns = @JoinColumn(name = "room_type_id"))
    @Column(name = "image_url", length = 500)
    List<String> imageUrls;

    @OneToMany(mappedBy = "roomType")
    Set<Room> rooms;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "room_type_amenities",
            joinColumns = @JoinColumn(name = "room_type_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id"))
    Set<Amenity> amenities;
}

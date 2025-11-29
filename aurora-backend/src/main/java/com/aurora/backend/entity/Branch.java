package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "branches", indexes = {
        @Index(name = "idx_branch_code", columnList = "code"),
        @Index(name = "idx_branch_status", columnList = "status"),
        @Index(name = "idx_branch_city", columnList = "city")
})
public class Branch extends BaseEntity {

    @NotBlank(message = "Branch name is required")
    @Size(max = 200, message = "Name cannot exceed 200 characters")
    @Column(nullable = false, length = 200)
    String name; // Tên chi nhánh (VD: "Aurora Hà Nội", "Aurora Sài Gòn")

    @NotBlank(message = "Branch code is required")
    @Pattern(regexp = "^[A-Z]{3}-[A-Z]{2,5}$", message = "Code must follow pattern: AUR-HN, AUR-SG")
    @Column(unique = true, nullable = false, length = 20)
    String code; // Mã chi nhánh (VD: "AUR-HN", "AUR-SG")

    // Địa chỉ chi tiết
    @NotBlank(message = "Address is required")
    @Size(max = 300, message = "Address cannot exceed 300 characters")
    @Column(length = 300)
    String address; // Địa chỉ cụ thể (số nhà, đường)
    
    @Size(max = 100, message = "Ward cannot exceed 100 characters")
    @Column(length = 100)
    String ward; // Phường/Xã
    
    @Size(max = 100, message = "District cannot exceed 100 characters")
    @Column(length = 100)
    String district; // Quận/Huyện
    
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    @Column(length = 100)
    String city; // Thành phố/Tỉnh

    // Geographic coordinates (for map display)
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    Double latitude;
    
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    Double longitude;

    // Liên hệ
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    @Column(nullable = false, length = 15)
    String phone;
    
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    @Column(length = 100)
    String email;
    
    @Size(max = 200, message = "Website URL cannot exceed 200 characters")
    @Column(length = 200)
    String website; // Branch website URL

    // Quản lý chi nhánh
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    User manager; // Người quản lý chi nhánh

    // Trạng thái
    @NotNull(message = "Branch status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    BranchStatus status = BranchStatus.ACTIVE;

    // Thông tin hoạt động
    LocalDate openingDate; // Ngày khai trương
    
    @NotNull(message = "Check-in time is required")
    @Column(nullable = false)
    @Builder.Default
    LocalTime checkInTime = LocalTime.of(14, 0); // Giờ nhận phòng mặc định: 14:00
    
    @NotNull(message = "Check-out time is required")
    @Column(nullable = false)
    @Builder.Default
    LocalTime checkOutTime = LocalTime.of(12, 0); // Giờ trả phòng mặc định: 12:00
    
    @Size(max = 50, message = "Operating hours cannot exceed 50 characters")
    @Column(length = 50)
    @Builder.Default
    String operatingHours = "24/7"; // Giờ hoạt động

    @Min(value = 0, message = "Total rooms cannot be negative")
    Integer totalRooms; // Tổng số phòng (WARN: should be calculated from Room count)
    
    @Min(value = 0, message = "Available rooms cannot be negative")
    Integer availableRooms; // Số phòng hiện có sẵn (WARN: should be calculated from Room status)

    // Mô tả
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Column(length = 2000)
    String description;
    
    @Size(max = 500, message = "Short description cannot exceed 500 characters")
    @Column(length = 500)
    String shortDescription;
    
    // Branch images
    @ElementCollection
    @CollectionTable(name = "branch_images", joinColumns = @JoinColumn(name = "branch_id"))
    @Column(name = "image_url", length = 500)
    List<String> imageUrls;

    // Relationships
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    Set<Room> rooms;

    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    Set<Facility> facilities;

    @OneToMany(mappedBy = "assignedBranch")
    Set<User> staff; // Danh sách nhân viên thuộc chi nhánh này

    // Enum for Branch Status
    public enum BranchStatus {
        ACTIVE,      // Đang hoạt động
        INACTIVE,    // Tạm ngừng
        MAINTENANCE  // Đang bảo trì
    }
}

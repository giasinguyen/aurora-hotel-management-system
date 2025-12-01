package com.aurora.backend.dto.response;

import com.aurora.backend.entity.Branch;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BranchResponse {
    
    String id;
    String name;
    String code;
    
    // Address details
    String address;
    String ward;
    String district;
    String city;
    String fullAddress; // Computed field: "address, ward, district, city"
    
    // Contact
    String phone;
    String email;
    
    // Manager info
    String managerId;
    String managerName; // Full name of manager
    String managerUsername;
    
    // Status
    Branch.BranchStatus status;
    
    // Operating info
    LocalDate openingDate;
    LocalTime checkInTime;
    LocalTime checkOutTime;
    String operatingHours;
    
    // Description
    String description;
    
    // Statistics
    Integer totalRooms;
    Integer totalStaff;
    Integer availableRooms; // Count of rooms with status AVAILABLE
    
    // Images
    List<String> images;
}

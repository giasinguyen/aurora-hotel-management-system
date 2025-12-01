package com.aurora.backend.dto.request;

import com.aurora.backend.entity.Branch;
import jakarta.validation.constraints.*;
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
public class BranchCreationRequest {
    
    @NotBlank(message = "Branch name is required")
    @Size(min = 3, max = 100, message = "Branch name must be between 3 and 100 characters")
    String name;
    
    @NotBlank(message = "Branch code is required")
    @Pattern(regexp = "^[A-Z]{3}-[A-Z]{2,3}$", message = "Branch code must follow format: XXX-XX (e.g., AUR-HN, AUR-SG)")
    String code;
    
    @NotBlank(message = "Address is required")
    String address;
    
    @NotBlank(message = "Ward is required")
    String ward;
    
    @NotBlank(message = "District is required")
    String district;
    
    @NotBlank(message = "City is required")
    String city;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Invalid Vietnamese phone number")
    String phone;
    
    @Email(message = "Invalid email format")
    String email;
    
    String managerId; // Optional - có thể assign manager sau
    
    @NotNull(message = "Status is required")
    Branch.BranchStatus status;
    
    LocalDate openingDate;
    
    LocalTime checkInTime;
    
    LocalTime checkOutTime;
    
    String operatingHours; // VD: "24/7" hoặc "6:00 - 22:00"
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description;
    
    // Images - danh sách URL ảnh
    List<String> images;
}

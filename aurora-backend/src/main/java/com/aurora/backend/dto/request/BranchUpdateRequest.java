package com.aurora.backend.dto.request;

import com.aurora.backend.entity.Branch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BranchUpdateRequest {
    
    @Size(min = 3, max = 100, message = "Branch name must be between 3 and 100 characters")
    String name;
    
    String address;
    String ward;
    String district;
    String city;
    
    @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Invalid Vietnamese phone number")
    String phone;
    
    @Email(message = "Invalid email format")
    String email;
    
    String managerId; // Update manager
    
    Branch.BranchStatus status;
    
    LocalDate openingDate;
    
    LocalTime checkInTime;
    LocalTime checkOutTime;
    
    String operatingHours;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description;
}

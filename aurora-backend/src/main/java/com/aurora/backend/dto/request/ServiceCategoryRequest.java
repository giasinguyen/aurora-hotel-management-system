package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCategoryRequest {
    
    @NotBlank(message = "Branch ID is required")
    String branchId;
    
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    String name;
    
    @NotBlank(message = "Category code is required")
    @Size(max = 50, message = "Code cannot exceed 50 characters")
    String code;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    String description;
    
    Integer displayOrder;
    
    Boolean active;
    
    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    String imageUrl;
}


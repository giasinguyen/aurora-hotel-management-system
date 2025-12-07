package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCreationRequest {
    @NotBlank(message = "BRANCH_ID_REQUIRED")
    String branchId;
    
    @NotBlank(message = "SERVICE_NAME_REQUIRED")
    String name;
    
    @NotBlank(message = "SERVICE_CATEGORY_REQUIRED")
    String categoryId;
    
    String description;
    
    @Positive(message = "BASE_PRICE_POSITIVE")
    Double basePrice;
    
    List<String> images;
}

package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCategoryResponse {
    String id;
    String branchId;
    String branchName;
    String name;
    String code;
    String description;
    Integer displayOrder;
    Boolean active;
    String imageUrl;
    
    // Số lượng services trong category này
    Integer totalServices;
    
    // Danh sách services (optional, có thể null nếu không cần load)
    List<ServiceResponse> services;
}


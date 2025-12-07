package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.ServiceCategoryRequest;
import com.aurora.backend.dto.response.ServiceCategoryResponse;
import com.aurora.backend.entity.ServiceCategory;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ServiceMapper.class})
public interface ServiceCategoryMapper {
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "totalServices", expression = "java(serviceCategory.getServices() != null ? serviceCategory.getServices().size() : 0)")
    @Mapping(target = "services", ignore = true)  // Không map services mặc định để tránh N+1
    ServiceCategoryResponse toResponse(ServiceCategory serviceCategory);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "totalServices", expression = "java(serviceCategory.getServices() != null ? serviceCategory.getServices().size() : 0)")
    @Mapping(target = "services", source = "services")  // Map services khi cần
    ServiceCategoryResponse toResponseWithServices(ServiceCategory serviceCategory);
    
    // MapStruct sẽ tự động dùng toResponse() cho List mapping
    default List<ServiceCategoryResponse> toResponseList(List<ServiceCategory> serviceCategories) {
        if (serviceCategories == null) {
            return null;
        }
        return serviceCategories.stream()
                .map(this::toResponse)
                .toList();
    }
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    ServiceCategory toEntity(ServiceCategoryRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget ServiceCategory serviceCategory, ServiceCategoryRequest request);
}


package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.ServiceCreationRequest;
import com.aurora.backend.dto.request.ServiceUpdateRequest;
import com.aurora.backend.dto.response.ServiceResponse;
import com.aurora.backend.entity.Service;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceMapper {
    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "id", ignore = true)
    Service toService(ServiceCreationRequest request);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    ServiceResponse toServiceResponse(Service service);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    void updateService(@MappingTarget Service service, ServiceUpdateRequest request);
}

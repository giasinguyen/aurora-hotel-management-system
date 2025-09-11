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
    @Mapping(target = "hotel.id", source = "hotelId")
    @Mapping(target = "id", ignore = true)
    Service toService(ServiceCreationRequest request);
    
    @Mapping(target = "hotelId", source = "hotel.id")
    @Mapping(target = "hotelName", source = "hotel.name")
    ServiceResponse toServiceResponse(Service service);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    void updateService(@MappingTarget Service service, ServiceUpdateRequest request);
}

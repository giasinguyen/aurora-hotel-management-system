package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.AmenityCreationRequest;
import com.aurora.backend.dto.request.AmenityUpdateRequest;
import com.aurora.backend.dto.response.AmenityResponse;
import com.aurora.backend.entity.Amenity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AmenityMapper {
    Amenity toAmenity(AmenityCreationRequest request);
    
    AmenityResponse toAmenityResponse(Amenity amenity);
    
    @Mapping(target = "id", ignore = true)
    void updateAmenityFromRequest(AmenityUpdateRequest request, @MappingTarget Amenity amenity);
}

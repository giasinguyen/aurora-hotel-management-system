package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.FacilityCreationRequest;
import com.aurora.backend.dto.request.FacilityUpdateRequest;
import com.aurora.backend.dto.response.FacilityResponse;
import com.aurora.backend.entity.Facility;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FacilityMapper {
    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "id", ignore = true)
    Facility toFacility(FacilityCreationRequest request);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    FacilityResponse toFacilityResponse(Facility facility);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    void updateFacilityFromRequest(FacilityUpdateRequest request, @MappingTarget Facility facility);
}

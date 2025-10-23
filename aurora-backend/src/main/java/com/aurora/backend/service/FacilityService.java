package com.aurora.backend.service;

import com.aurora.backend.dto.request.FacilityCreationRequest;
import com.aurora.backend.dto.request.FacilityUpdateRequest;
import com.aurora.backend.dto.response.FacilityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FacilityService {
    FacilityResponse createFacility(FacilityCreationRequest request);
    List<FacilityResponse> getFacilities();
    Page<FacilityResponse> getFacilitiesWithPagination(Pageable pageable);
    FacilityResponse getFacility(String id);
    List<FacilityResponse> getFacilitiesByBranch(String branchId);
    Page<FacilityResponse> getFacilitiesByBranchWithPagination(String branchId, Pageable pageable);
    FacilityResponse updateFacility(String id, FacilityUpdateRequest request);
    void deleteFacility(String id);
    Page<FacilityResponse> searchFacilitiesByName(String name, Pageable pageable);
}

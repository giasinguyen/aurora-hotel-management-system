package com.aurora.backend.service;

import com.aurora.backend.dto.request.AmenityCreationRequest;
import com.aurora.backend.dto.request.AmenityUpdateRequest;
import com.aurora.backend.dto.response.AmenityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AmenityService {
    AmenityResponse createAmenity(AmenityCreationRequest request);
    List<AmenityResponse> getAmenities();
    Page<AmenityResponse> getAmenitiesWithPagination(Pageable pageable);
    AmenityResponse getAmenity(String id);
    AmenityResponse getAmenityByName(String name);
    AmenityResponse updateAmenity(String id, AmenityUpdateRequest request);
    void deleteAmenity(String id);
    Page<AmenityResponse> searchAmenitiesByName(String name, Pageable pageable);
    Page<AmenityResponse> getAmenitiesByType(String type, Pageable pageable);
}


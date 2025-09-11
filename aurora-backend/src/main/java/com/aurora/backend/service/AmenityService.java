package com.aurora.backend.service;

import com.aurora.backend.dto.request.AmenityCreationRequest;
import com.aurora.backend.dto.request.AmenityUpdateRequest;
import com.aurora.backend.dto.response.AmenityResponse;
import com.aurora.backend.entity.Amenity;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.AmenityMapper;
import com.aurora.backend.repository.AmenityRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AmenityService {
    AmenityRepository amenityRepository;
    AmenityMapper amenityMapper;

    public AmenityResponse createAmenity(AmenityCreationRequest request) {
        log.info("Creating amenity with name: {}", request.getName());
        
        if (amenityRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.AMENITY_EXISTED);

        Amenity amenity = amenityMapper.toAmenity(request);
        Amenity savedAmenity = amenityRepository.save(amenity);
        
        log.info("Amenity created successfully with ID: {}", savedAmenity.getId());
        return amenityMapper.toAmenityResponse(savedAmenity);
    }

    public List<AmenityResponse> getAmenities() {
        log.info("Fetching all amenities");
        return amenityRepository.findAll().stream()
                .map(amenityMapper::toAmenityResponse)
                .toList();
    }

    public Page<AmenityResponse> getAmenitiesWithPagination(Pageable pageable) {
        log.info("Fetching amenities with pagination: page {}, size {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return amenityRepository.findAll(pageable)
                .map(amenityMapper::toAmenityResponse);
    }

    public AmenityResponse getAmenity(String id) {
        log.info("Fetching amenity by ID: {}", id);
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_EXISTED));
        return amenityMapper.toAmenityResponse(amenity);
    }

    public AmenityResponse getAmenityByName(String name) {
        log.info("Fetching amenity by name: {}", name);
        Amenity amenity = amenityRepository.findByName(name)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_EXISTED));
        return amenityMapper.toAmenityResponse(amenity);
    }

    public AmenityResponse updateAmenity(String id, AmenityUpdateRequest request) {
        log.info("Updating amenity with ID: {}", id);
        
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_EXISTED));

        // Check if name already exists for another amenity
        if (request.getName() != null && !request.getName().equals(amenity.getName()) 
                && amenityRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.AMENITY_EXISTED);
        }

        amenityMapper.updateAmenityFromRequest(request, amenity);
        Amenity updatedAmenity = amenityRepository.save(amenity);
        
        log.info("Amenity updated successfully with ID: {}", updatedAmenity.getId());
        return amenityMapper.toAmenityResponse(updatedAmenity);
    }

    public void deleteAmenity(String id) {
        log.info("Deleting amenity with ID: {}", id);
        
        if (!amenityRepository.existsById(id)) {
            throw new AppException(ErrorCode.AMENITY_NOT_EXISTED);
        }
        
        amenityRepository.deleteById(id);
        log.info("Amenity deleted successfully with ID: {}", id);
    }

    public Page<AmenityResponse> searchAmenitiesByName(String name, Pageable pageable) {
        log.info("Searching amenities by name: {} with pagination", name);
        return amenityRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(amenityMapper::toAmenityResponse);
    }

    public Page<AmenityResponse> getAmenitiesByType(String type, Pageable pageable) {
        log.info("Fetching amenities by type: {} with pagination", type);
        return amenityRepository.findByType(type, pageable)
                .map(amenityMapper::toAmenityResponse);
    }
}

package com.aurora.backend.service;

import com.aurora.backend.dto.request.FacilityCreationRequest;
import com.aurora.backend.dto.request.FacilityUpdateRequest;
import com.aurora.backend.dto.response.FacilityResponse;
import com.aurora.backend.entity.Facility;
import com.aurora.backend.entity.Hotel;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.FacilityMapper;
import com.aurora.backend.repository.FacilityRepository;
import com.aurora.backend.repository.HotelRepository;
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
public class FacilityService {
    FacilityRepository facilityRepository;
    HotelRepository hotelRepository;
    FacilityMapper facilityMapper;

    public FacilityResponse createFacility(FacilityCreationRequest request) {
        log.info("Creating facility with name: {} for hotel: {}", request.getName(), request.getHotelId());
        
        // Check if hotel exists
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_EXISTED));
        
        // Check if facility already exists in this hotel
        if (facilityRepository.existsByHotelIdAndName(request.getHotelId(), request.getName())) {
            throw new AppException(ErrorCode.FACILITY_EXISTED);
        }

        Facility facility = facilityMapper.toFacility(request);
        facility.setHotel(hotel);
        
        Facility savedFacility = facilityRepository.save(facility);
        log.info("Facility created successfully with ID: {}", savedFacility.getId());
        
        return facilityMapper.toFacilityResponse(savedFacility);
    }

    public List<FacilityResponse> getFacilities() {
        log.info("Fetching all facilities");
        return facilityRepository.findAll().stream()
                .map(facilityMapper::toFacilityResponse)
                .toList();
    }

    public Page<FacilityResponse> getFacilitiesWithPagination(Pageable pageable) {
        log.info("Fetching facilities with pagination: page {}, size {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return facilityRepository.findAll(pageable)
                .map(facilityMapper::toFacilityResponse);
    }

    public FacilityResponse getFacility(String id) {
        log.info("Fetching facility by ID: {}", id);
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FACILITY_NOT_EXISTED));
        return facilityMapper.toFacilityResponse(facility);
    }

    public List<FacilityResponse> getFacilitiesByHotel(String hotelId) {
        log.info("Fetching facilities by hotel ID: {}", hotelId);
        
        // Check if hotel exists
        if (!hotelRepository.existsById(hotelId)) {
            throw new AppException(ErrorCode.HOTEL_NOT_EXISTED);
        }
        
        return facilityRepository.findByHotelId(hotelId).stream()
                .map(facilityMapper::toFacilityResponse)
                .toList();
    }

    public Page<FacilityResponse> getFacilitiesByHotelWithPagination(String hotelId, Pageable pageable) {
        log.info("Fetching facilities by hotel ID: {} with pagination", hotelId);
        
        // Check if hotel exists
        if (!hotelRepository.existsById(hotelId)) {
            throw new AppException(ErrorCode.HOTEL_NOT_EXISTED);
        }
        
        return facilityRepository.findByHotelId(hotelId, pageable)
                .map(facilityMapper::toFacilityResponse);
    }

    public FacilityResponse updateFacility(String id, FacilityUpdateRequest request) {
        log.info("Updating facility with ID: {}", id);
        
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FACILITY_NOT_EXISTED));

        // Check if name already exists for another facility in the same hotel
        if (request.getName() != null && !request.getName().equals(facility.getName()) 
                && facilityRepository.existsByHotelIdAndName(facility.getHotel().getId(), request.getName())) {
            throw new AppException(ErrorCode.FACILITY_EXISTED);
        }

        facilityMapper.updateFacilityFromRequest(request, facility);
        Facility updatedFacility = facilityRepository.save(facility);
        
        log.info("Facility updated successfully with ID: {}", updatedFacility.getId());
        return facilityMapper.toFacilityResponse(updatedFacility);
    }

    public void deleteFacility(String id) {
        log.info("Deleting facility with ID: {}", id);
        
        if (!facilityRepository.existsById(id)) {
            throw new AppException(ErrorCode.FACILITY_NOT_EXISTED);
        }
        
        facilityRepository.deleteById(id);
        log.info("Facility deleted successfully with ID: {}", id);
    }

    public Page<FacilityResponse> searchFacilitiesByName(String name, Pageable pageable) {
        log.info("Searching facilities by name: {} with pagination", name);
        return facilityRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(facilityMapper::toFacilityResponse);
    }
}

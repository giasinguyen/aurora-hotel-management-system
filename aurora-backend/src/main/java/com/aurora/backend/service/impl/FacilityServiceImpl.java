package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.FacilityCreationRequest;
import com.aurora.backend.dto.request.FacilityUpdateRequest;
import com.aurora.backend.dto.response.FacilityResponse;
import com.aurora.backend.entity.Facility;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.FacilityMapper;
import com.aurora.backend.repository.FacilityRepository;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.service.FacilityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class FacilityServiceImpl implements FacilityService {
    
    FacilityRepository facilityRepository;
    BranchRepository branchRepository;
    FacilityMapper facilityMapper;

    @Override
    @Transactional
    public FacilityResponse createFacility(FacilityCreationRequest request) {
        log.info("Creating facility with name: {} for branch: {}", request.getName(), request.getBranchId());
        
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        if (facilityRepository.existsByBranchIdAndName(request.getBranchId(), request.getName())) {
            throw new AppException(ErrorCode.FACILITY_EXISTED);
        }

        Facility facility = facilityMapper.toFacility(request);
        facility.setBranch(branch);
        
        Facility savedFacility = facilityRepository.save(facility);
        log.info("Facility created successfully with ID: {}", savedFacility.getId());
        
        return facilityMapper.toFacilityResponse(savedFacility);
    }

    @Override
    public List<FacilityResponse> getFacilities() {
        log.info("Fetching all facilities");
        return facilityRepository.findAll().stream()
                .map(facilityMapper::toFacilityResponse)
                .toList();
    }

    @Override
    public Page<FacilityResponse> getFacilitiesWithPagination(Pageable pageable) {
        log.info("Fetching facilities with pagination: page {}, size {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return facilityRepository.findAll(pageable)
                .map(facilityMapper::toFacilityResponse);
    }

    @Override
    public FacilityResponse getFacility(String id) {
        log.info("Fetching facility by ID: {}", id);
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FACILITY_NOT_EXISTED));
        return facilityMapper.toFacilityResponse(facility);
    }

    @Override
    public List<FacilityResponse> getFacilitiesByBranch(String branchId) {
        log.info("Fetching facilities by branch ID: {}", branchId);
        
        if (!branchRepository.existsById(branchId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
        
        return facilityRepository.findByBranchId(branchId).stream()
                .map(facilityMapper::toFacilityResponse)
                .toList();
    }

    @Override
    public Page<FacilityResponse> getFacilitiesByBranchWithPagination(String branchId, Pageable pageable) {
        log.info("Fetching facilities by branch ID: {} with pagination", branchId);
        
        if (!branchRepository.existsById(branchId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
        
        return facilityRepository.findByBranchId(branchId, pageable)
                .map(facilityMapper::toFacilityResponse);
    }

    @Override
    @Transactional
    public FacilityResponse updateFacility(String id, FacilityUpdateRequest request) {
        log.info("Updating facility with ID: {}", id);
        
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FACILITY_NOT_EXISTED));

        if (request.getName() != null && !request.getName().equals(facility.getName())
                && facilityRepository.existsByBranchIdAndName(facility.getBranch().getId(), request.getName())) {
            throw new AppException(ErrorCode.FACILITY_EXISTED);
        }

        facilityMapper.updateFacilityFromRequest(request, facility);
        Facility updatedFacility = facilityRepository.save(facility);
        
        log.info("Facility updated successfully with ID: {}", updatedFacility.getId());
        return facilityMapper.toFacilityResponse(updatedFacility);
    }

    @Override
    @Transactional
    public void deleteFacility(String id) {
        log.info("Deleting facility with ID: {}", id);
        
        if (!facilityRepository.existsById(id)) {
            throw new AppException(ErrorCode.FACILITY_NOT_EXISTED);
        }
        
        facilityRepository.deleteById(id);
        log.info("Facility deleted successfully with ID: {}", id);
    }

    @Override
    public Page<FacilityResponse> searchFacilitiesByName(String name, Pageable pageable) {
        log.info("Searching facilities by name: {} with pagination", name);
        return facilityRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(facilityMapper::toFacilityResponse);
    }
}

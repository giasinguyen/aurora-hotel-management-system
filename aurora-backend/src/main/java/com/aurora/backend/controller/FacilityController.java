package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.FacilityCreationRequest;
import com.aurora.backend.dto.request.FacilityUpdateRequest;
import com.aurora.backend.dto.response.FacilityResponse;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.service.FacilityService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/facilities")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacilityController {
    FacilityService facilityService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RequirePermission(PermissionConstants.Manager.ROOM_CREATE)
    ApiResponse<FacilityResponse> createFacility(@RequestBody @Valid FacilityCreationRequest facilityCreationRequest) {
        log.info("Creating new facility with name: {} for hotel: {}", 
                facilityCreationRequest.getName(), facilityCreationRequest.getHotelId());
        return ApiResponse.<FacilityResponse>builder()
                .result(facilityService.createFacility(facilityCreationRequest))
                .build();
    }

    @GetMapping
    // Public - no permission needed
    ApiResponse<List<FacilityResponse>> getAllFacilities() {
        log.info("Fetching all facilities");
        return ApiResponse.<List<FacilityResponse>>builder()
                .result(facilityService.getFacilities())
                .build();
    }

    @GetMapping("/paginated")
    ApiResponse<Page<FacilityResponse>> getFacilitiesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("Fetching facilities with pagination - page: {}, size: {}, sortBy: {}, direction: {}", 
                page, size, sortBy, sortDirection);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<FacilityResponse>>builder()
                .result(facilityService.getFacilitiesWithPagination(pageable))
                .build();
    }

    @GetMapping("/{facilityId}")
    ApiResponse<FacilityResponse> getFacility(@PathVariable("facilityId") String facilityId) {
        log.info("Fetching facility with ID: {}", facilityId);
        return ApiResponse.<FacilityResponse>builder()
                .result(facilityService.getFacility(facilityId))
                .build();
    }

    @GetMapping("/hotel/{hotelId}")
    ApiResponse<List<FacilityResponse>> getFacilitiesByHotel(@PathVariable("hotelId") String hotelId) {
        log.info("Fetching facilities for hotel: {}", hotelId);
        return ApiResponse.<List<FacilityResponse>>builder()
                .result(facilityService.getFacilitiesByHotel(hotelId))
                .build();
    }

    @GetMapping("/hotel/{hotelId}/paginated")
    ApiResponse<Page<FacilityResponse>> getFacilitiesByHotelWithPagination(
            @PathVariable("hotelId") String hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("Fetching facilities for hotel: {} with pagination", hotelId);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<FacilityResponse>>builder()
                .result(facilityService.getFacilitiesByHotelWithPagination(hotelId, pageable))
                .build();
    }

    @PutMapping("/{facilityId}")
    @RequirePermission(PermissionConstants.Manager.ROOM_UPDATE)
    ApiResponse<FacilityResponse> updateFacility(
            @PathVariable("facilityId") String facilityId,
            @RequestBody @Valid FacilityUpdateRequest facilityUpdateRequest) {
        log.info("Updating facility with ID: {}", facilityId);
        return ApiResponse.<FacilityResponse>builder()
                .result(facilityService.updateFacility(facilityId, facilityUpdateRequest))
                .build();
    }

    @DeleteMapping("/{facilityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequirePermission(PermissionConstants.Manager.ROOM_DELETE)
    ApiResponse<Void> deleteFacility(@PathVariable("facilityId") String facilityId) {
        log.info("Deleting facility with ID: {}", facilityId);
        facilityService.deleteFacility(facilityId);
        return ApiResponse.<Void>builder()
                .message("Facility deleted successfully")
                .build();
    }

    @GetMapping("/search")
    ApiResponse<Page<FacilityResponse>> searchFacilities(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching facilities with name containing: {}", name);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<FacilityResponse>>builder()
                .result(facilityService.searchFacilitiesByName(name, pageable))
                .build();
    }
}

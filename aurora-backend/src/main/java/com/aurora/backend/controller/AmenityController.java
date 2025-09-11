package com.aurora.backend.controller;

import com.aurora.backend.dto.request.AmenityCreationRequest;
import com.aurora.backend.dto.request.AmenityUpdateRequest;
import com.aurora.backend.dto.response.AmenityResponse;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.service.AmenityService;
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
@RequestMapping("/amenities")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AmenityController {
    AmenityService amenityService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<AmenityResponse> createAmenity(@RequestBody @Valid AmenityCreationRequest amenityCreationRequest) {
        log.info("Creating new amenity with name: {}", amenityCreationRequest.getName());
        return ApiResponse.<AmenityResponse>builder()
                .result(amenityService.createAmenity(amenityCreationRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<AmenityResponse>> getAllAmenities() {
        log.info("Fetching all amenities");
        return ApiResponse.<List<AmenityResponse>>builder()
                .result(amenityService.getAmenities())
                .build();
    }

    @GetMapping("/paginated")
    ApiResponse<Page<AmenityResponse>> getAmenitiesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("Fetching amenities with pagination - page: {}, size: {}, sortBy: {}, direction: {}", 
                page, size, sortBy, sortDirection);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<AmenityResponse>>builder()
                .result(amenityService.getAmenitiesWithPagination(pageable))
                .build();
    }

    @GetMapping("/{amenityId}")
    ApiResponse<AmenityResponse> getAmenity(@PathVariable("amenityId") String amenityId) {
        log.info("Fetching amenity with ID: {}", amenityId);
        return ApiResponse.<AmenityResponse>builder()
                .result(amenityService.getAmenity(amenityId))
                .build();
    }

    @GetMapping("/name/{name}")
    ApiResponse<AmenityResponse> getAmenityByName(@PathVariable("name") String name) {
        log.info("Fetching amenity with name: {}", name);
        return ApiResponse.<AmenityResponse>builder()
                .result(amenityService.getAmenityByName(name))
                .build();
    }

    @PutMapping("/{amenityId}")
    ApiResponse<AmenityResponse> updateAmenity(
            @PathVariable("amenityId") String amenityId,
            @RequestBody @Valid AmenityUpdateRequest amenityUpdateRequest) {
        log.info("Updating amenity with ID: {}", amenityId);
        return ApiResponse.<AmenityResponse>builder()
                .result(amenityService.updateAmenity(amenityId, amenityUpdateRequest))
                .build();
    }

    @DeleteMapping("/{amenityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    ApiResponse<Void> deleteAmenity(@PathVariable("amenityId") String amenityId) {
        log.info("Deleting amenity with ID: {}", amenityId);
        amenityService.deleteAmenity(amenityId);
        return ApiResponse.<Void>builder()
                .message("Amenity deleted successfully")
                .build();
    }

    @GetMapping("/search")
    ApiResponse<Page<AmenityResponse>> searchAmenities(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching amenities with name containing: {}", name);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<AmenityResponse>>builder()
                .result(amenityService.searchAmenitiesByName(name, pageable))
                .build();
    }

    @GetMapping("/type/{type}")
    ApiResponse<Page<AmenityResponse>> getAmenitiesByType(
            @PathVariable("type") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Fetching amenities by type: {}", type);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<AmenityResponse>>builder()
                .result(amenityService.getAmenitiesByType(type, pageable))
                .build();
    }
}

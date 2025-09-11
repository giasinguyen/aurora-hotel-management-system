package com.aurora.backend.controller;

import com.aurora.backend.dto.request.HotelCreationRequest;
import com.aurora.backend.dto.request.HotelUpdateRequest;
import com.aurora.backend.dto.response.HotelResponse;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.service.HotelService;
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
@RequestMapping("/hotels")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelController {
    HotelService hotelService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<HotelResponse> createHotel(@RequestBody @Valid HotelCreationRequest hotelCreationRequest) {
        log.info("Creating new hotel with code: {}", hotelCreationRequest.getCode());
        return ApiResponse.<HotelResponse>builder()
                .result(hotelService.createHotel(hotelCreationRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<HotelResponse>> getAllHotels() {
        log.info("Fetching all hotels");
        return ApiResponse.<List<HotelResponse>>builder()
                .result(hotelService.getHotels())
                .build();
    }

    @GetMapping("/paginated")
    ApiResponse<Page<HotelResponse>> getHotelsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("Fetching hotels with pagination - page: {}, size: {}, sortBy: {}, direction: {}", 
                page, size, sortBy, sortDirection);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<HotelResponse>>builder()
                .result(hotelService.getHotelsWithPagination(pageable))
                .build();
    }

    @GetMapping("/{hotelId}")
    ApiResponse<HotelResponse> getHotel(@PathVariable("hotelId") String hotelId) {
        log.info("Fetching hotel with ID: {}", hotelId);
        return ApiResponse.<HotelResponse>builder()
                .result(hotelService.getHotel(hotelId))
                .build();
    }

    @GetMapping("/code/{code}")
    ApiResponse<HotelResponse> getHotelByCode(@PathVariable("code") String code) {
        log.info("Fetching hotel with code: {}", code);
        return ApiResponse.<HotelResponse>builder()
                .result(hotelService.getHotelByCode(code))
                .build();
    }

    @PutMapping("/{hotelId}")
    ApiResponse<HotelResponse> updateHotel(
            @PathVariable("hotelId") String hotelId,
            @RequestBody @Valid HotelUpdateRequest hotelUpdateRequest) {
        log.info("Updating hotel with ID: {}", hotelId);
        return ApiResponse.<HotelResponse>builder()
                .result(hotelService.updateHotel(hotelId, hotelUpdateRequest))
                .build();
    }

    @DeleteMapping("/{hotelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    ApiResponse<Void> deleteHotel(@PathVariable("hotelId") String hotelId) {
        log.info("Deleting hotel with ID: {}", hotelId);
        hotelService.deleteHotel(hotelId);
        return ApiResponse.<Void>builder()
                .message("Hotel deleted successfully")
                .build();
    }

    @GetMapping("/search/name")
    ApiResponse<Page<HotelResponse>> searchHotelsByName(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching hotels with name containing: {}", name);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<HotelResponse>>builder()
                .result(hotelService.searchHotelsByName(name, pageable))
                .build();
    }

    @GetMapping("/search/address")
    ApiResponse<Page<HotelResponse>> searchHotelsByAddress(
            @RequestParam String address,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching hotels with address containing: {}", address);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<HotelResponse>>builder()
                .result(hotelService.searchHotelsByAddress(address, pageable))
                .build();
    }
}

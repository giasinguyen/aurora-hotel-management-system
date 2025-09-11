package com.aurora.backend.controller;

import com.aurora.backend.dto.request.RoomTypeCreationRequest;
import com.aurora.backend.dto.request.RoomTypeUpdateRequest;
import com.aurora.backend.dto.response.RoomTypeResponse;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.service.RoomTypeService;
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
@RequestMapping("/room-types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomTypeController {
    RoomTypeService roomTypeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    ApiResponse<RoomTypeResponse> createRoomType(@RequestBody @Valid RoomTypeCreationRequest roomTypeCreationRequest) {
        log.info("Creating new room type with name: {} for hotel: {}", 
                roomTypeCreationRequest.getName(), roomTypeCreationRequest.getHotelId());
        return ApiResponse.<RoomTypeResponse>builder()
                .result(roomTypeService.createRoomType(roomTypeCreationRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<RoomTypeResponse>> getAllRoomTypes() {
        log.info("Fetching all room types");
        return ApiResponse.<List<RoomTypeResponse>>builder()
                .result(roomTypeService.getRoomTypes())
                .build();
    }

    @GetMapping("/paginated")
    ApiResponse<Page<RoomTypeResponse>> getRoomTypesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("Fetching room types with pagination - page: {}, size: {}, sortBy: {}, direction: {}", 
                page, size, sortBy, sortDirection);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<RoomTypeResponse>>builder()
                .result(roomTypeService.getRoomTypesWithPagination(pageable))
                .build();
    }

    @GetMapping("/{roomTypeId}")
    ApiResponse<RoomTypeResponse> getRoomType(@PathVariable("roomTypeId") String roomTypeId) {
        log.info("Fetching room type with ID: {}", roomTypeId);
        return ApiResponse.<RoomTypeResponse>builder()
                .result(roomTypeService.getRoomType(roomTypeId))
                .build();
    }

    @GetMapping("/hotel/{hotelId}")
    ApiResponse<List<RoomTypeResponse>> getRoomTypesByHotel(@PathVariable("hotelId") String hotelId) {
        log.info("Fetching room types for hotel: {}", hotelId);
        return ApiResponse.<List<RoomTypeResponse>>builder()
                .result(roomTypeService.getRoomTypesByHotel(hotelId))
                .build();
    }

    @GetMapping("/hotel/{hotelId}/paginated")
    ApiResponse<Page<RoomTypeResponse>> getRoomTypesByHotelWithPagination(
            @PathVariable("hotelId") String hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("Fetching room types for hotel: {} with pagination", hotelId);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ApiResponse.<Page<RoomTypeResponse>>builder()
                .result(roomTypeService.getRoomTypesByHotelWithPagination(hotelId, pageable))
                .build();
    }

    @PutMapping("/{roomTypeId}")
    ApiResponse<RoomTypeResponse> updateRoomType(
            @PathVariable("roomTypeId") String roomTypeId,
            @RequestBody @Valid RoomTypeUpdateRequest roomTypeUpdateRequest) {
        log.info("Updating room type with ID: {}", roomTypeId);
        return ApiResponse.<RoomTypeResponse>builder()
                .result(roomTypeService.updateRoomType(roomTypeId, roomTypeUpdateRequest))
                .build();
    }

    @DeleteMapping("/{roomTypeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    ApiResponse<Void> deleteRoomType(@PathVariable("roomTypeId") String roomTypeId) {
        log.info("Deleting room type with ID: {}", roomTypeId);
        roomTypeService.deleteRoomType(roomTypeId);
        return ApiResponse.<Void>builder()
                .message("Room type deleted successfully")
                .build();
    }

    @GetMapping("/search")
    ApiResponse<Page<RoomTypeResponse>> searchRoomTypes(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching room types with name containing: {}", name);
        Pageable pageable = PageRequest.of(page, size);
        
        return ApiResponse.<Page<RoomTypeResponse>>builder()
                .result(roomTypeService.searchRoomTypesByName(name, pageable))
                .build();
    }
}

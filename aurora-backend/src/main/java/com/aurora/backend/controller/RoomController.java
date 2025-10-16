package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.RoomCreationRequest;
import com.aurora.backend.dto.request.RoomUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.RoomResponse;
import com.aurora.backend.service.RoomService;
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

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoomController {
    
    RoomService roomService;

    @PostMapping
    @RequirePermission(PermissionConstants.Manager.ROOM_CREATE)
    public ApiResponse<RoomResponse> createRoom(@Valid @RequestBody RoomCreationRequest request) {
        log.info("Creating new room with number: {} for hotel: {}", request.getRoomNumber(), request.getHotelId());
        
        RoomResponse response = roomService.createRoom(request);
        
        return ApiResponse.<RoomResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Room created successfully")
                .result(response)
                .build();
    }

    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Manager.ROOM_UPDATE)
    public ApiResponse<RoomResponse> updateRoom(
            @PathVariable String id,
            @Valid @RequestBody RoomUpdateRequest request) {
        log.info("Updating room with ID: {}", id);
        
        RoomResponse response = roomService.updateRoom(id, request);
        
        return ApiResponse.<RoomResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Room updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Manager.ROOM_DELETE)
    public ApiResponse<Void> deleteRoom(@PathVariable String id) {
        log.info("Deleting room with ID: {}", id);
        
        roomService.deleteRoom(id);
        
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Room deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    // Public - no permission needed
    public ApiResponse<RoomResponse> getRoomById(@PathVariable String id) {
        log.debug("Fetching room with ID: {}", id);
        
        RoomResponse response = roomService.getRoomById(id);
        
        return ApiResponse.<RoomResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Room retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
    public ApiResponse<Page<RoomResponse>> getAllRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        log.debug("Fetching all rooms - page: {}, size: {}, sortBy: {}, sortDir: {}", 
                page, size, sortBy, sortDir);
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<RoomResponse> response = roomService.getAllRooms(pageable);
        
        return ApiResponse.<Page<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Rooms retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/hotel/{hotelId}")
    public ApiResponse<Page<RoomResponse>> getRoomsByHotel(
            @PathVariable String hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        log.debug("Fetching rooms for hotel: {} - page: {}, size: {}", hotelId, page, size);
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<RoomResponse> response = roomService.getRoomsByHotel(hotelId, pageable);
        
        return ApiResponse.<Page<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Rooms retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/room-type/{roomTypeId}")
    public ApiResponse<Page<RoomResponse>> getRoomsByRoomType(
            @PathVariable String roomTypeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        log.debug("Fetching rooms for room type: {} - page: {}, size: {}", roomTypeId, page, size);
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<RoomResponse> response = roomService.getRoomsByRoomType(roomTypeId, pageable);
        
        return ApiResponse.<Page<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Rooms retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/status/{status}")
    public ApiResponse<Page<RoomResponse>> getRoomsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        log.debug("Fetching rooms with status: {} - page: {}, size: {}", status, page, size);
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<RoomResponse> response = roomService.getRoomsByStatus(status, pageable);
        
        return ApiResponse.<Page<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Rooms retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<RoomResponse>> searchRooms(
            @RequestParam(required = false) String hotelId,
            @RequestParam(required = false) String roomTypeId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        log.debug("Searching rooms with filters - Hotel: {}, RoomType: {}, Status: {}", 
                hotelId, roomTypeId, status);
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<RoomResponse> response = roomService.searchRooms(hotelId, roomTypeId, status, pageable);
        
        return ApiResponse.<Page<RoomResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Rooms searched successfully")
                .result(response)
                .build();
    }
}

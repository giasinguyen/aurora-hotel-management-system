package com.aurora.backend.service;

import com.aurora.backend.dto.request.RoomTypeCreationRequest;
import com.aurora.backend.dto.request.RoomTypeUpdateRequest;
import com.aurora.backend.dto.response.RoomTypeResponse;
import com.aurora.backend.entity.Amenity;
import com.aurora.backend.entity.Hotel;
import com.aurora.backend.entity.RoomType;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.RoomTypeMapper;
import com.aurora.backend.repository.AmenityRepository;
import com.aurora.backend.repository.HotelRepository;
import com.aurora.backend.repository.RoomTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoomTypeService {
    RoomTypeRepository roomTypeRepository;
    HotelRepository hotelRepository;
    AmenityRepository amenityRepository;
    RoomTypeMapper roomTypeMapper;

    public RoomTypeResponse createRoomType(RoomTypeCreationRequest request) {
        log.info("Creating room type with name: {} for hotel: {}", request.getName(), request.getHotelId());
        
        // Check if hotel exists
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_EXISTED));
        
        // Check if room type already exists in this hotel
        if (roomTypeRepository.existsByHotelIdAndName(request.getHotelId(), request.getName())) {
            throw new AppException(ErrorCode.ROOM_TYPE_EXISTED);
        }
        
        // Check if code already exists in this hotel
        if (request.getCode() != null && roomTypeRepository.existsByHotelIdAndCode(request.getHotelId(), request.getCode())) {
            throw new AppException(ErrorCode.ROOM_TYPE_EXISTED);
        }

        RoomType roomType = roomTypeMapper.toRoomType(request);
        roomType.setHotel(hotel);
        
        // Set amenities if provided
        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(request.getAmenityIds()));
            roomType.setAmenities(amenities);
        }
        
        RoomType savedRoomType = roomTypeRepository.save(roomType);
        log.info("Room type created successfully with ID: {}", savedRoomType.getId());
        
        return roomTypeMapper.toRoomTypeResponse(savedRoomType);
    }

    public List<RoomTypeResponse> getRoomTypes() {
        log.info("Fetching all room types");
        return roomTypeRepository.findAll().stream()
                .map(roomTypeMapper::toRoomTypeResponse)
                .toList();
    }

    public Page<RoomTypeResponse> getRoomTypesWithPagination(Pageable pageable) {
        log.info("Fetching room types with pagination: page {}, size {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return roomTypeRepository.findAll(pageable)
                .map(roomTypeMapper::toRoomTypeResponse);
    }

    public RoomTypeResponse getRoomType(String id) {
        log.info("Fetching room type by ID: {}", id);
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_EXISTED));
        return roomTypeMapper.toRoomTypeResponse(roomType);
    }

    public List<RoomTypeResponse> getRoomTypesByHotel(String hotelId) {
        log.info("Fetching room types by hotel ID: {}", hotelId);
        
        // Check if hotel exists
        if (!hotelRepository.existsById(hotelId)) {
            throw new AppException(ErrorCode.HOTEL_NOT_EXISTED);
        }
        
        return roomTypeRepository.findByHotelId(hotelId).stream()
                .map(roomTypeMapper::toRoomTypeResponse)
                .toList();
    }

    public Page<RoomTypeResponse> getRoomTypesByHotelWithPagination(String hotelId, Pageable pageable) {
        log.info("Fetching room types by hotel ID: {} with pagination", hotelId);
        
        // Check if hotel exists
        if (!hotelRepository.existsById(hotelId)) {
            throw new AppException(ErrorCode.HOTEL_NOT_EXISTED);
        }
        
        return roomTypeRepository.findByHotelId(hotelId, pageable)
                .map(roomTypeMapper::toRoomTypeResponse);
    }

    public RoomTypeResponse updateRoomType(String id, RoomTypeUpdateRequest request) {
        log.info("Updating room type with ID: {}", id);
        
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_EXISTED));

        // Check if name already exists for another room type in the same hotel
        if (request.getName() != null && !request.getName().equals(roomType.getName()) 
                && roomTypeRepository.existsByHotelIdAndName(roomType.getHotel().getId(), request.getName())) {
            throw new AppException(ErrorCode.ROOM_TYPE_EXISTED);
        }
        
        // Check if code already exists for another room type in the same hotel
        if (request.getCode() != null && !request.getCode().equals(roomType.getCode()) 
                && roomTypeRepository.existsByHotelIdAndCode(roomType.getHotel().getId(), request.getCode())) {
            throw new AppException(ErrorCode.ROOM_TYPE_EXISTED);
        }

        roomTypeMapper.updateRoomTypeFromRequest(request, roomType);
        
        // Update amenities if provided
        if (request.getAmenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(request.getAmenityIds()));
            roomType.setAmenities(amenities);
        }
        
        RoomType updatedRoomType = roomTypeRepository.save(roomType);
        
        log.info("Room type updated successfully with ID: {}", updatedRoomType.getId());
        return roomTypeMapper.toRoomTypeResponse(updatedRoomType);
    }

    public void deleteRoomType(String id) {
        log.info("Deleting room type with ID: {}", id);
        
        if (!roomTypeRepository.existsById(id)) {
            throw new AppException(ErrorCode.ROOM_TYPE_NOT_EXISTED);
        }
        
        roomTypeRepository.deleteById(id);
        log.info("Room type deleted successfully with ID: {}", id);
    }

    public Page<RoomTypeResponse> searchRoomTypesByName(String name, Pageable pageable) {
        log.info("Searching room types by name: {} with pagination", name);
        return roomTypeRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(roomTypeMapper::toRoomTypeResponse);
    }
}

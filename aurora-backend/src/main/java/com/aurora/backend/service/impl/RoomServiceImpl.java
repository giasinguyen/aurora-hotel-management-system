package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.RoomCreationRequest;
import com.aurora.backend.dto.request.RoomUpdateRequest;
import com.aurora.backend.dto.response.RoomResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Room;
import com.aurora.backend.entity.RoomType;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.RoomMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.RoomRepository;
import com.aurora.backend.repository.RoomTypeRepository;
import com.aurora.backend.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class RoomServiceImpl implements RoomService {
    
    RoomRepository roomRepository;
    BranchRepository branchRepository;
    RoomTypeRepository roomTypeRepository;
    RoomMapper roomMapper;

    @Override
    @Transactional
    public RoomResponse createRoom(RoomCreationRequest request) {
        log.info("Creating room with number: {} for branch: {}", request.getRoomNumber(), request.getBranchId());
        
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND));
        
        if (!roomType.getBranch().getId().equals(request.getBranchId())) {
            throw new AppException(ErrorCode.ROOM_TYPE_HOTEL_MISMATCH);
        }
        
        if (roomRepository.existsByBranchAndRoomNumber(branch, request.getRoomNumber())) {
            throw new AppException(ErrorCode.ROOM_NUMBER_ALREADY_EXISTS);
        }
        
        Room room = roomMapper.toRoom(request);
        room.setBranch(branch);
        room.setRoomType(roomType);
        
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            room.setStatus(Room.RoomStatus.AVAILABLE);
        }
        
        Room savedRoom = roomRepository.save(room);
        log.info("Room created successfully with ID: {}", savedRoom.getId());
        
        return roomMapper.toRoomResponse(savedRoom);
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(String id, RoomUpdateRequest request) {
        log.info("Updating room with ID: {}", id);
        
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        
        if (request.getRoomTypeId() != null && !request.getRoomTypeId().equals(room.getRoomType().getId())) {
            RoomType newRoomType = roomTypeRepository.findById(request.getRoomTypeId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND));
            
            if (!newRoomType.getBranch().getId().equals(room.getBranch().getId())) {
                throw new AppException(ErrorCode.ROOM_TYPE_HOTEL_MISMATCH);
            }
            
            room.setRoomType(newRoomType);
        }
        
        if (request.getRoomNumber() != null && !request.getRoomNumber().equals(room.getRoomNumber())) {
            if (roomRepository.existsByBranchAndRoomNumber(room.getBranch(), request.getRoomNumber())) {
                throw new AppException(ErrorCode.ROOM_NUMBER_ALREADY_EXISTS);
            }
            room.setRoomNumber(request.getRoomNumber());
        }
        
        roomMapper.updateRoom(room, request);
        
        Room updatedRoom = roomRepository.save(room);
        log.info("Room updated successfully with ID: {}", updatedRoom.getId());
        
        return roomMapper.toRoomResponse(updatedRoom);
    }

    @Override
    @Transactional
    public void deleteRoom(String id) {
        log.info("Deleting room with ID: {}", id);
        
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        
        roomRepository.delete(room);
        log.info("Room deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getRoomById(String id) {
        log.debug("Fetching room with ID: {}", id);
        
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        
        return roomMapper.toRoomResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoomResponse> getAllRooms(Pageable pageable) {
        log.debug("Fetching all rooms with pagination: {}", pageable);
        
        Page<Room> rooms = roomRepository.findAll(pageable);
        return rooms.map(roomMapper::toRoomResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoomResponse> getRoomsByBranch(String branchId, Pageable pageable) {
        log.debug("Fetching rooms for branch ID: {} with pagination: {}", branchId, pageable);
        
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        Page<Room> rooms = roomRepository.findByBranch(branch, pageable);
        return rooms.map(roomMapper::toRoomResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoomResponse> getRoomsByRoomType(String roomTypeId, Pageable pageable) {
        log.debug("Fetching rooms for room type ID: {} with pagination: {}", roomTypeId, pageable);
        
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND));
        
        Page<Room> rooms = roomRepository.findByRoomType(roomType, pageable);
        return rooms.map(roomMapper::toRoomResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoomResponse> getRoomsByStatus(String status, Pageable pageable) {
        log.debug("Fetching rooms with status: {} with pagination: {}", status, pageable);
        
        Page<Room> rooms = roomRepository.findByStatus(status, pageable);
        return rooms.map(roomMapper::toRoomResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoomResponse> searchRooms(String branchId, String roomTypeId, String status, Pageable pageable) {
        log.debug("Searching rooms with filters - Branch: {}, RoomType: {}, Status: {}", branchId, roomTypeId, status);
        
        Branch branch = null;
        RoomType roomType = null;
        
        if (branchId != null && !branchId.trim().isEmpty()) {
            branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        }
        
        if (roomTypeId != null && !roomTypeId.trim().isEmpty()) {
            roomType = roomTypeRepository.findById(roomTypeId)
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND));
        }
        
        Page<Room> rooms = roomRepository.findByFilters(branch, roomType, status, pageable);
        return rooms.map(roomMapper::toRoomResponse);
    }
}

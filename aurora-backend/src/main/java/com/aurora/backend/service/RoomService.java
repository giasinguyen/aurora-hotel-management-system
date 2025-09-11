package com.aurora.backend.service;

import com.aurora.backend.dto.request.RoomCreationRequest;
import com.aurora.backend.dto.request.RoomUpdateRequest;
import com.aurora.backend.dto.response.RoomResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomService {
    RoomResponse createRoom(RoomCreationRequest request);
    RoomResponse updateRoom(String id, RoomUpdateRequest request);
    void deleteRoom(String id);
    RoomResponse getRoomById(String id);
    Page<RoomResponse> getAllRooms(Pageable pageable);
    Page<RoomResponse> getRoomsByHotel(String hotelId, Pageable pageable);
    Page<RoomResponse> getRoomsByRoomType(String roomTypeId, Pageable pageable);
    Page<RoomResponse> getRoomsByStatus(String status, Pageable pageable);
    Page<RoomResponse> searchRooms(String hotelId, String roomTypeId, String status, Pageable pageable);
}

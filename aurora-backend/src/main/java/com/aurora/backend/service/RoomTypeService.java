package com.aurora.backend.service;

import com.aurora.backend.dto.request.RoomTypeCreationRequest;
import com.aurora.backend.dto.request.RoomTypeUpdateRequest;
import com.aurora.backend.dto.response.RoomTypeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoomTypeService {
    RoomTypeResponse createRoomType(RoomTypeCreationRequest request);
    List<RoomTypeResponse> getRoomTypes();
    Page<RoomTypeResponse> getRoomTypesWithPagination(Pageable pageable);
    RoomTypeResponse getRoomType(String id);
    List<RoomTypeResponse> getRoomTypesByHotel(String branchId);
    Page<RoomTypeResponse> getRoomTypesByHotelWithPagination(String branchId, Pageable pageable);
    RoomTypeResponse updateRoomType(String id, RoomTypeUpdateRequest request);
    void deleteRoomType(String id);
    Page<RoomTypeResponse> searchRoomTypesByName(String name, Pageable pageable);
}

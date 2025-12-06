package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.RoomTypeCreationRequest;
import com.aurora.backend.dto.request.RoomTypeUpdateRequest;
import com.aurora.backend.dto.response.RoomTypeResponse;
import com.aurora.backend.entity.RoomType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {AmenityMapper.class})
public interface RoomTypeMapper {
    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rooms", ignore = true)
    @Mapping(target = "amenities", ignore = true)
    RoomType toRoomType(RoomTypeCreationRequest request);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "totalRooms", expression = "java(roomType.getRooms() != null ? roomType.getRooms().size() : 0)")
    @Mapping(target = "availableRooms", constant = "0") // Calculate based on room status
    RoomTypeResponse toRoomTypeResponse(RoomType roomType);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "rooms", ignore = true)
    @Mapping(target = "amenities", ignore = true)
    void updateRoomTypeFromRequest(RoomTypeUpdateRequest request, @MappingTarget RoomType roomType);
}

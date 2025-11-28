package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.RoomCreationRequest;
import com.aurora.backend.dto.request.RoomUpdateRequest;
import com.aurora.backend.dto.response.RoomResponse;
import com.aurora.backend.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "roomType.id", source = "roomTypeId")
    @Mapping(target = "id", ignore = true)
    Room toRoom(RoomCreationRequest request);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "roomTypeId", source = "roomType.id")
    @Mapping(target = "roomTypeName", source = "roomType.name")
    @Mapping(target = "capacityAdults", source = "roomType.capacityAdults")
    @Mapping(target = "capacityChildren", source = "roomType.capacityChildren")
    @Mapping(target = "sizeM2", source = "roomType.sizeM2")
    RoomResponse toRoomResponse(Room room);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "roomType", ignore = true)
    void updateRoom(@MappingTarget Room room, RoomUpdateRequest request);
}

package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.RoomCategoryRequest;
import com.aurora.backend.dto.response.RoomCategoryResponse;
import com.aurora.backend.entity.RoomCategory;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {RoomTypeMapper.class})
public interface RoomCategoryMapper {
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "totalRoomTypes", expression = "java(roomCategory.getRoomTypes() != null ? roomCategory.getRoomTypes().size() : 0)")
    @Mapping(target = "roomTypes", ignore = true)  // Không map roomTypes mặc định để tránh N+1
    RoomCategoryResponse toResponse(RoomCategory roomCategory);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "totalRoomTypes", expression = "java(roomCategory.getRoomTypes() != null ? roomCategory.getRoomTypes().size() : 0)")
    @Mapping(target = "roomTypes", source = "roomTypes")  // Map roomTypes khi cần
    RoomCategoryResponse toResponseWithRoomTypes(RoomCategory roomCategory);
    
    // MapStruct sẽ tự động dùng toResponse() cho List mapping
    default List<RoomCategoryResponse> toResponseList(List<RoomCategory> roomCategories) {
        if (roomCategories == null) {
            return null;
        }
        return roomCategories.stream()
                .map(this::toResponse)
                .toList();
    }
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "roomTypes", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    RoomCategory toEntity(RoomCategoryRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "roomTypes", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget RoomCategory roomCategory, RoomCategoryRequest request);
}


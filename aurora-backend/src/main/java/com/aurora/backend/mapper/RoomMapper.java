package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.RoomCreationRequest;
import com.aurora.backend.dto.request.RoomUpdateRequest;
import com.aurora.backend.dto.response.RoomResponse;
import com.aurora.backend.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "roomType.id", source = "roomTypeId")
    @Mapping(target = "salePercent", expression = "java(request.getSalePercent() != null ? request.getSalePercent() : java.math.BigDecimal.ZERO)")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lastCleaned", ignore = true)
    @Mapping(target = "maintenanceNotes", ignore = true)
    Room toRoom(RoomCreationRequest request);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "roomTypeId", source = "roomType.id")
    @Mapping(target = "roomTypeName", source = "roomType.name")
    @Mapping(target = "categoryId", source = "roomType.category.id")
    @Mapping(target = "categoryName", source = "roomType.category.name")
    @Mapping(target = "capacityAdults", source = "roomType.capacityAdults")
    @Mapping(target = "capacityChildren", source = "roomType.capacityChildren")
    @Mapping(target = "sizeM2", source = "roomType.sizeM2")
    @Mapping(target = "displayPrice", expression = "java(calculateDisplayPrice(room.getBasePrice(), room.getSalePercent()))")
    RoomResponse toRoomResponse(Room room);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "roomType", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lastCleaned", ignore = true)
    @Mapping(target = "maintenanceNotes", ignore = true)
    void updateRoom(@MappingTarget Room room, RoomUpdateRequest request);
    
    /**
     * Calculate display price from base price and sale percent
     * displayPrice = basePrice * (100 - salePercent) / 100
     */
    default BigDecimal calculateDisplayPrice(BigDecimal basePrice, BigDecimal salePercent) {
        if (basePrice == null) {
            return BigDecimal.ZERO;
        }
        if (salePercent == null || salePercent.compareTo(BigDecimal.ZERO) == 0) {
            return basePrice;
        }
        BigDecimal discount = BigDecimal.valueOf(100).subtract(salePercent);
        return basePrice.multiply(discount)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}

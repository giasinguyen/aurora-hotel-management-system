package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.PromotionCreationRequest;
import com.aurora.backend.dto.request.PromotionUpdateRequest;
import com.aurora.backend.dto.response.PromotionResponse;
import com.aurora.backend.entity.Promotion;
import com.aurora.backend.entity.RoomType;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "applicableRoomTypes", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(source = "startDate", target = "startAt")
    @Mapping(source = "endDate", target = "endAt")
    Promotion toPromotion(PromotionCreationRequest request);
    
    @Mapping(source = "branch.id", target = "branchId")
    @Mapping(source = "branch.name", target = "branchName")
    @Mapping(source = "startAt", target = "startDate")
    @Mapping(source = "endAt", target = "endDate")
    @Mapping(target = "applicableRoomTypeIds", expression = "java(promotion.getApplicableRoomTypes() != null ? promotion.getApplicableRoomTypes().stream().map(rt -> rt.getId()).collect(java.util.stream.Collectors.toSet()) : null)")
    @Mapping(target = "applicableRoomTypes", expression = "java(mapRoomTypes(promotion.getApplicableRoomTypes()))")
    PromotionResponse toPromotionResponse(Promotion promotion);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "applicableRoomTypes", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(source = "startDate", target = "startAt")
    @Mapping(source = "endDate", target = "endAt")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePromotion(@MappingTarget Promotion promotion, 
                        PromotionUpdateRequest request);
    
    default Set<PromotionResponse.RoomTypeInfo> mapRoomTypes(Set<RoomType> roomTypes) {
        if (roomTypes == null || roomTypes.isEmpty()) {
            return null;
        }
        return roomTypes.stream()
                .map(rt -> PromotionResponse.RoomTypeInfo.builder()
                        .id(rt.getId())
                        .name(rt.getName())
                        .code(rt.getCode())
                        .build())
                .collect(Collectors.toSet());
    }
}

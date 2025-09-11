package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.PromotionCreationRequest;
import com.aurora.backend.dto.request.PromotionUpdateRequest;
import com.aurora.backend.dto.response.PromotionResponse;
import com.aurora.backend.entity.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(source = "startDate", target = "startAt")
    @Mapping(source = "endDate", target = "endAt")
    @Mapping(source = "discount", target = "percentOff")
    @Mapping(source = "description", target = "conditions")
    Promotion toPromotion(PromotionCreationRequest request);
    
    @Mapping(source = "startAt", target = "startDate")
    @Mapping(source = "endAt", target = "endDate")
    @Mapping(source = "percentOff", target = "discount")
    @Mapping(source = "conditions", target = "description")
    PromotionResponse toPromotionResponse(Promotion promotion);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(source = "startDate", target = "startAt")
    @Mapping(source = "endDate", target = "endAt")
    @Mapping(source = "discount", target = "percentOff")
    @Mapping(source = "description", target = "conditions")
    void updatePromotion(@MappingTarget Promotion promotion, 
                        PromotionUpdateRequest request);
}

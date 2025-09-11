package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.HotelCreationRequest;
import com.aurora.backend.dto.request.HotelUpdateRequest;
import com.aurora.backend.dto.response.HotelResponse;
import com.aurora.backend.entity.Hotel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface HotelMapper {
    Hotel toHotel(HotelCreationRequest request);
    
    @Mapping(target = "totalRooms", expression = "java(hotel.getRooms() != null ? hotel.getRooms().size() : 0)")
    @Mapping(target = "availableRooms", constant = "0") // This should be calculated based on availability
    HotelResponse toHotelResponse(Hotel hotel);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "rooms", ignore = true)
    void updateHotelFromRequest(HotelUpdateRequest request, @MappingTarget Hotel hotel);
}

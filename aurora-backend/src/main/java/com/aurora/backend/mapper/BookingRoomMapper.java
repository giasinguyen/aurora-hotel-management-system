package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.BookingRoomCreationRequest;
import com.aurora.backend.dto.request.BookingRoomUpdateRequest;
import com.aurora.backend.dto.response.BookingRoomResponse;
import com.aurora.backend.entity.BookingRoom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookingRoomMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "room", ignore = true)
    BookingRoom toBookingRoom(BookingRoomCreationRequest request);
    
    BookingRoomResponse toBookingRoomResponse(BookingRoom bookingRoom);
    
    void updateBookingRoom(@MappingTarget BookingRoom bookingRoom, 
                          BookingRoomUpdateRequest request);
}

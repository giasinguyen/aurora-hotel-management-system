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
    
    @Mapping(target = "bookingId", expression = "java(bookingRoom.getBooking() != null ? bookingRoom.getBooking().getId() : null)")
    @Mapping(target = "bookingCode", expression = "java(bookingRoom.getBooking() != null ? bookingRoom.getBooking().getBookingCode() : null)")
    @Mapping(target = "roomId", expression = "java(bookingRoom.getRoom() != null ? bookingRoom.getRoom().getId() : null)")
    @Mapping(target = "roomNumber", expression = "java(bookingRoom.getRoom() != null ? bookingRoom.getRoom().getRoomNumber() : null)")
    @Mapping(target = "roomType", expression = "java(bookingRoom.getRoom() != null && bookingRoom.getRoom().getRoomType() != null ? bookingRoom.getRoom().getRoomType().getName() : null)")
    @Mapping(target = "pricePerNight", expression = "java(bookingRoom.getPricePerNight() != null ? bookingRoom.getPricePerNight().doubleValue() : 0.0)")
    @Mapping(target = "totalPrice", expression = "java(bookingRoom.getTotalAmount() != null ? bookingRoom.getTotalAmount().doubleValue() : (bookingRoom.getPricePerNight() != null && bookingRoom.getNights() != null ? bookingRoom.getPricePerNight().multiply(java.math.BigDecimal.valueOf(bookingRoom.getNights())).doubleValue() : 0.0))")
    BookingRoomResponse toBookingRoomResponse(BookingRoom bookingRoom);
    
    void updateBookingRoom(@MappingTarget BookingRoom bookingRoom, 
                          BookingRoomUpdateRequest request);
}

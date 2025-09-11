package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.BookingResponse;
import com.aurora.backend.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(target = "hotel.id", source = "hotelId")
    @Mapping(target = "customer.id", source = "customerId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true)
    Booking toBooking(BookingCreationRequest request);
    
    @Mapping(target = "hotelId", source = "hotel.id")
    @Mapping(target = "hotelName", source = "hotel.name")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", expression = "java(booking.getCustomer().getFirstName() + \" \" + booking.getCustomer().getLastName())")
    BookingResponse toBookingResponse(Booking booking);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(target = "customer", ignore = true)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);
}

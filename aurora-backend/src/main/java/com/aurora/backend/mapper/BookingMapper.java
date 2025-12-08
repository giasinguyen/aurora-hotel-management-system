package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.BookingCreationRequest;
import com.aurora.backend.dto.request.BookingUpdateRequest;
import com.aurora.backend.dto.response.BookingResponse;
import com.aurora.backend.entity.Booking;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = {BookingRoomMapper.class})
public interface BookingMapper {
    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "customer.id", source = "customerId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true)
    @Mapping(target = "customer", ignore = true) // Will be set manually in service
    Booking toBooking(BookingCreationRequest request);
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "customerId", expression = "java(booking.getCustomer() != null ? booking.getCustomer().getId() : null)")
    @Mapping(target = "customerName", expression = "java(booking.getCustomer() != null ? (booking.getCustomer().getFirstName() + \" \" + booking.getCustomer().getLastName()).trim() : booking.getGuestFullName())")
    @Mapping(target = "guestFullName", source = "guestFullName")
    @Mapping(target = "guestEmail", source = "guestEmail")
    @Mapping(target = "guestPhone", source = "guestPhone")
    BookingResponse toBookingResponse(Booking booking);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingCode", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true) // Don't update status via this endpoint
    @Mapping(target = "paymentStatus", ignore = true) // Don't update paymentStatus via this endpoint
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);
}

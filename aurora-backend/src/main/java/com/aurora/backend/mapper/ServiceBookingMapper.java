package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.ServiceBookingCreationRequest;
import com.aurora.backend.dto.request.ServiceBookingUpdateRequest;
import com.aurora.backend.dto.response.ServiceBookingResponse;
import com.aurora.backend.entity.ServiceBooking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceBookingMapper {
    @Mapping(target = "booking.id", source = "bookingId")
    @Mapping(target = "service.id", source = "serviceId")
    @Mapping(target = "customer.id", source = "customerId")
    @Mapping(target = "id", ignore = true)
    ServiceBooking toServiceBooking(ServiceBookingCreationRequest request);
    
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "bookingCode", source = "booking.bookingCode")
    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "serviceName", source = "service.name")
    @Mapping(target = "serviceType", source = "service.type")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", expression = "java(serviceBooking.getCustomer().getFirstName() + \" \" + serviceBooking.getCustomer().getLastName())")
    ServiceBookingResponse toServiceBookingResponse(ServiceBooking serviceBooking);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "customer", ignore = true)
    void updateServiceBooking(@MappingTarget ServiceBooking serviceBooking, ServiceBookingUpdateRequest request);
}

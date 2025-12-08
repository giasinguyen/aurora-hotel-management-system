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
    @Mapping(target = "room.id", source = "roomId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "pricePerUnit", expression = "java(request.getPrice() != null ? java.math.BigDecimal.valueOf(request.getPrice()) : null)")
    @Mapping(target = "serviceDateTime", source = "dateTime")
    @Mapping(target = "totalPrice", expression = "java(request.getPrice() != null && request.getQuantity() != null ? java.math.BigDecimal.valueOf(request.getPrice()).multiply(java.math.BigDecimal.valueOf(request.getQuantity())) : null)")
    ServiceBooking toServiceBooking(ServiceBookingCreationRequest request);
    
    @Mapping(target = "bookingId", expression = "java(serviceBooking.getBooking() != null ? serviceBooking.getBooking().getId() : null)")
    @Mapping(target = "bookingCode", expression = "java(serviceBooking.getBooking() != null ? serviceBooking.getBooking().getBookingCode() : null)")
    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "serviceName", source = "service.name")
    @Mapping(target = "serviceType", expression = "java(serviceBooking.getService().getCategory() != null ? serviceBooking.getService().getCategory().getName() : null)")
    @Mapping(target = "customerId", expression = "java(serviceBooking.getCustomer() != null ? serviceBooking.getCustomer().getId() : null)")
    @Mapping(target = "customerName", expression = "java(serviceBooking.getCustomer() != null ? (serviceBooking.getCustomer().getFirstName() != null ? serviceBooking.getCustomer().getFirstName() : \"\") + \" \" + (serviceBooking.getCustomer().getLastName() != null ? serviceBooking.getCustomer().getLastName() : \"\") : null)")
    @Mapping(target = "roomId", expression = "java(serviceBooking.getRoom() != null ? serviceBooking.getRoom().getId() : null)")
    @Mapping(target = "roomNumber", expression = "java(serviceBooking.getRoom() != null ? serviceBooking.getRoom().getRoomNumber() : null)")
    @Mapping(target = "dateTime", source = "serviceDateTime")
    @Mapping(target = "price", expression = "java(serviceBooking.getPricePerUnit() != null ? serviceBooking.getPricePerUnit().doubleValue() : 0.0)")
    @Mapping(target = "status", expression = "java(serviceBooking.getStatus() != null ? serviceBooking.getStatus().name() : null)")
    ServiceBookingResponse toServiceBookingResponse(ServiceBooking serviceBooking);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "customer", ignore = true)
    void updateServiceBooking(@MappingTarget ServiceBooking serviceBooking, ServiceBookingUpdateRequest request);
}

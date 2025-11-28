package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.PaymentCreationRequest;
import com.aurora.backend.dto.request.PaymentUpdateRequest;
import com.aurora.backend.dto.response.PaymentResponse;
import com.aurora.backend.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "booking.id", source = "bookingId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    Payment toPayment(PaymentCreationRequest request);
    
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "bookingCode", source = "booking.bookingCode")
    PaymentResponse toPaymentResponse(Payment payment);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "method", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    void updatePayment(@MappingTarget Payment payment, PaymentUpdateRequest request);
}

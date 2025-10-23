package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceBookingResponse {
    String id;
    String bookingId;
    String bookingCode;
    String serviceId;
    String serviceName;
    String serviceType;
    String customerId;
    String customerName;
    LocalDateTime dateTime;
    Integer quantity;
    Double price;
    String status;
}

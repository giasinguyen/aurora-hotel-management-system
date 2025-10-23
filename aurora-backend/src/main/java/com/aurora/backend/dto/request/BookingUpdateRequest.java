package com.aurora.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingUpdateRequest {
    LocalDate checkin;
    LocalDate checkout;
    Double totalPrice;
    String status;
    String paymentStatus;
    String specialRequest;
}

package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    String id;
    String bookingCode;
    String hotelId;
    String hotelName;
    String customerId;
    String customerName;
    LocalDate checkin;
    LocalDate checkout;
    Double totalPrice;
    String status;
    String paymentStatus;
    String specialRequest;
    Set<BookingRoomResponse> rooms;
}

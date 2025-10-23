package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRoomResponse {
    String id;
    String bookingId;
    String bookingCode;
    String roomId;
    String roomNumber;
    String roomType;
    Double pricePerNight;
    Integer nights;
    Double totalPrice; // pricePerNight * nights
}

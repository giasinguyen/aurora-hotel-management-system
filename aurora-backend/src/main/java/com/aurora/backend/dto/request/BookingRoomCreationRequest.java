package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRoomCreationRequest {
    @NotBlank(message = "BOOKING_ID_REQUIRED")
    String bookingId;
    
    @NotBlank(message = "ROOM_ID_REQUIRED")
    String roomId;
    
    @NotNull(message = "PRICE_REQUIRED")
    @Positive(message = "PRICE_POSITIVE")
    Double pricePerNight;
    
    @NotNull(message = "NIGHTS_REQUIRED")
    @Positive(message = "NIGHTS_POSITIVE")
    Integer nights;
}

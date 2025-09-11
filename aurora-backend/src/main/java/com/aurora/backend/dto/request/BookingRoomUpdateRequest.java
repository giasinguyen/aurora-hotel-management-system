package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRoomUpdateRequest {
    @Positive(message = "PRICE_POSITIVE")
    Double pricePerNight;
    
    @Positive(message = "NIGHTS_POSITIVE")
    Integer nights;
}

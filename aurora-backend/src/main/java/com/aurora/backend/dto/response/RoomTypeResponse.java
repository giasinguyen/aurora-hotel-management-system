package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomTypeResponse {
    String id;
    String hotelId;
    String hotelName;
    String name;
    String code;
    Integer capacityAdults;
    Integer capacityChildren;
    Double sizeM2;
    Boolean refundable;
    Integer totalRooms;
    Integer availableRooms;
    Set<AmenityResponse> amenities;
}

package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {
    String id;
    String hotelId;
    String hotelName;
    String roomTypeId;
    String roomTypeName;
    String roomNumber;
    Integer floor;
    String status;
    Integer capacityAdults;
    Integer capacityChildren;
    Double sizeM2;
}

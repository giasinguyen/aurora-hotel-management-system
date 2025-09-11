package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelResponse {
    String id;
    String name;
    String code;
    String address;
    String phone;
    String checkInTime;
    String checkOutTime;
    Integer totalRooms;
    Integer availableRooms;
}

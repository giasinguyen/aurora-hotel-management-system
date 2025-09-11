package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelUpdateRequest {
    String name;
    String address;
    
    @Pattern(regexp = "^[0-9+\\-\\s()]+$", message = "PHONE_INVALID")
    String phone;
    
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "TIME_FORMAT_INVALID")
    String checkInTime;
    
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "TIME_FORMAT_INVALID")
    String checkOutTime;
}

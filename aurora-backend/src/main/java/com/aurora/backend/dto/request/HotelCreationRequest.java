package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelCreationRequest {
    @NotBlank(message = "HOTEL_NAME_REQUIRED")
    String name;
    
    @NotBlank(message = "HOTEL_CODE_REQUIRED")
    String code;
    
    @NotBlank(message = "HOTEL_ADDRESS_REQUIRED")
    String address;
    
    @Pattern(regexp = "^[0-9+\\-\\s()]+$", message = "PHONE_INVALID")
    String phone;
    
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "TIME_FORMAT_INVALID")
    String checkInTime;
    
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "TIME_FORMAT_INVALID")
    String checkOutTime;
}

package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckMultipleRoomsRequest {
    
    @NotEmpty(message = "Room IDs list cannot be empty")
    List<String> roomIds;
    
    @NotNull(message = "Check-in date is required")
    LocalDate checkinDate;
    
    @NotNull(message = "Check-out date is required")
    LocalDate checkoutDate;
}

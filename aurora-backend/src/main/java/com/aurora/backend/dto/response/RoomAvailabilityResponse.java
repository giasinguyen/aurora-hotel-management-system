package com.aurora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomAvailabilityResponse {
    private String roomId;
    private String roomNumber;
    private String roomType;
    private LocalDate startDate;
    private LocalDate endDate;

    private Map<LocalDate, Boolean> availabilityMap;

    private int totalAvailableDays;
    private int totalBookedDays;
}

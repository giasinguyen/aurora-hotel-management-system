package com.aurora.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FacilityUpdateRequest {
    String name;
    String openingHours;
    String policies;
    List<String> images;
}

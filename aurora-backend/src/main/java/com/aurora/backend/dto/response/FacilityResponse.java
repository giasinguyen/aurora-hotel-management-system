package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FacilityResponse {
    String id;
    String branchId;
    String branchName;
    String name;
    String openingHours;
    String policies;
    List<String> images;
}

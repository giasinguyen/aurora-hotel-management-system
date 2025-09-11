package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionResponse {
    String id;
    String code;
    String name;
    String description;
    Double discount;
    LocalDate startDate;
    LocalDate endDate;
    Boolean active;
}

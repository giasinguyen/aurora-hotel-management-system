package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsVisibilityRequest {
    @NotNull(message = "IS_PUBLIC_REQUIRED")
    Boolean isPublic;
}

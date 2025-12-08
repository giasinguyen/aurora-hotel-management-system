package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GalleryImageResponse {
    String imageUrl;
    String sourceType; // "ROOM" or "SERVICE"
    String sourceId;
    String sourceName;
}


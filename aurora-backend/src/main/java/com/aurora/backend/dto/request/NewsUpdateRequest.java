package com.aurora.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsUpdateRequest {
    String title;
    String slug;
    String description;
    String thumbnailUrl;
    Map<String, Object> contentJson;
    String contentHtml;
    Boolean isPublic;
}

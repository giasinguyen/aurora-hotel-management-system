package com.aurora.backend.dto.response;

import com.aurora.backend.enums.NewsStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsResponse {
    String id;
    String slug;
    String title;
    String description;
    String thumbnailUrl;
    Boolean isPublic;
    Map<String, Object> contentJson;
    String contentHtml;
    NewsStatus status;
    LocalDateTime publishedAt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String createdBy;
    List<ImageAssetResponse> images;
}

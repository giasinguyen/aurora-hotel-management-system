package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsCreationRequest {
    String id; // Optional: for updating existing news
    
    @NotBlank(message = "NEWS_TITLE_REQUIRED")
    String title;
    
    @NotBlank(message = "NEWS_SLUG_REQUIRED")
    String slug;
    
    String description;
    
    String thumbnailUrl;
    
    @NotNull(message = "NEWS_CONTENT_REQUIRED")
    Map<String, Object> contentJson;
    
    String contentHtml;
    
    Boolean isPublic;
}

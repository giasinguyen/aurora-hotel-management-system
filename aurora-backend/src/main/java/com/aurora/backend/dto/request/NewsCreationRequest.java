package com.aurora.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotBlank;
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
    
    // thumbnailUrl will be set by service after uploading file
    String thumbnailUrl;
    
    // Store as Map internally but accept String from form data
    Map<String, Object> contentJson;
    
    String contentHtml;
    
    Boolean isPublic;
    
    // Custom setter to handle String to Map conversion for multipart form data
    @JsonSetter("contentJson")
    public void setContentJson(Object contentJson) {
        if (contentJson instanceof String) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                this.contentJson = objectMapper.readValue((String) contentJson, Map.class);
            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException("Invalid JSON string for contentJson", e);
            }
        } else if (contentJson instanceof Map) {
            this.contentJson = (Map<String, Object>) contentJson;
        } else if (contentJson != null) {
            throw new IllegalArgumentException("contentJson must be either a String or Map");
        }
    }
}

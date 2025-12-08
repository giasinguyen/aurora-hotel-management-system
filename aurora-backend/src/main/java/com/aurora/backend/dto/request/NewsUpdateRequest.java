package com.aurora.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

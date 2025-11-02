package com.aurora.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewUpdateRequest {
    
    @Min(value = 1, message = "RATING_INVALID")
    @Max(value = 5, message = "RATING_INVALID")
    Integer rating;
    
    @Size(min = 10, message = "COMMENT_TOO_SHORT")
    String comment;
    
    @Size(max = 5, message = "TOO_MANY_PHOTOS")
    List<String> photos;
}


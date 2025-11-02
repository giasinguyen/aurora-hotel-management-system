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
public class ReviewCreationRequest {
    
    @NotBlank(message = "BOOKING_ID_REQUIRED")
    String bookingId;
    
    String roomId; // Optional - có thể review chỉ branch/service mà không review specific room
    
    @NotNull(message = "RATING_REQUIRED")
    @Min(value = 1, message = "RATING_INVALID")
    @Max(value = 5, message = "RATING_INVALID")
    Integer rating;
    
    @NotBlank(message = "COMMENT_REQUIRED")
    @Size(min = 10, message = "COMMENT_TOO_SHORT")
    String comment;
    
    @Size(max = 5, message = "TOO_MANY_PHOTOS")
    List<String> photos;
}


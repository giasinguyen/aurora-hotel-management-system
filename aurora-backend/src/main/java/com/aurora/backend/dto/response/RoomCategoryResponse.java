package com.aurora.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomCategoryResponse {
    String id;
    String branchId;
    String branchName;
    String name;
    String code;
    String description;
    Integer displayOrder;
    Boolean active;
    String imageUrl;
    
    // Số lượng room types trong category này
    Integer totalRoomTypes;
    
    // Danh sách room types (optional, có thể null nếu không cần load)
    List<RoomTypeResponse> roomTypes;
}


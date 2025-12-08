package com.aurora.backend.dto.response;

import com.aurora.backend.entity.Promotion;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionResponse {
    String id;
    String branchId;
    String branchName;
    String code;
    String name;
    LocalDate startDate;
    LocalDate endDate;
    Boolean active;
    Promotion.DiscountType discountType;
    BigDecimal percentOff;
    BigDecimal amountOff;
    BigDecimal minBookingAmount;
    Integer minNights;
    Integer usageLimit;
    Integer usedCount;
    BigDecimal maxDiscountAmount;
    Set<String> applicableRoomTypeIds;
    Set<RoomTypeInfo> applicableRoomTypes; // For display
    Boolean stackable;
    Boolean exclusiveWithOthers;
    String description;
    String termsAndConditions;
    Integer priority;
    String createdBy;
    
    // Helper field for backward compatibility
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    Double discount; // Computed from percentOff or amountOff
    
    public Double getDiscount() {
        if (discountType == Promotion.DiscountType.PERCENTAGE && percentOff != null) {
            return percentOff.doubleValue();
        } else if (discountType == Promotion.DiscountType.FIXED_AMOUNT && amountOff != null) {
            return amountOff.doubleValue();
        }
        return 0.0;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RoomTypeInfo {
        String id;
        String name;
        String code;
    }
}

package com.aurora.backend.dto.request;

import com.aurora.backend.entity.Promotion;
import jakarta.validation.constraints.*;
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
public class PromotionUpdateRequest {
    String branchId; // Null = áp dụng cho tất cả chi nhánh
    
    @Size(max = 200, message = "NAME_LENGTH")
    String name;
    
    LocalDate startDate;
    LocalDate endDate;
    
    Boolean active;
    
    Promotion.DiscountType discountType;
    
    @DecimalMin(value = "0.0", message = "PERCENT_OFF_MIN")
    @DecimalMax(value = "100.0", message = "PERCENT_OFF_MAX")
    BigDecimal percentOff;
    
    @DecimalMin(value = "0.0", message = "AMOUNT_OFF_MIN")
    BigDecimal amountOff;
    
    @DecimalMin(value = "0.0", message = "MIN_BOOKING_AMOUNT_MIN")
    BigDecimal minBookingAmount;
    
    @Min(value = 1, message = "MIN_NIGHTS_MIN")
    Integer minNights;
    
    @Min(value = 1, message = "USAGE_LIMIT_MIN")
    Integer usageLimit;
    
    @DecimalMin(value = "0.0", message = "MAX_DISCOUNT_AMOUNT_MIN")
    BigDecimal maxDiscountAmount;
    
    Set<String> applicableRoomTypeIds;
    
    Boolean stackable;
    
    Boolean exclusiveWithOthers;
    
    @Size(max = 1000, message = "DESCRIPTION_LENGTH")
    String description;
    
    @Size(max = 2000, message = "TERMS_LENGTH")
    String termsAndConditions;
    
    @Min(value = 0, message = "PRIORITY_MIN")
    Integer priority;
}

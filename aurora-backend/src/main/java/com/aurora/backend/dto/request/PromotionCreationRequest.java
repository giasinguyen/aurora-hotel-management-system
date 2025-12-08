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
public class PromotionCreationRequest {
    String branchId; // Null = áp dụng cho tất cả chi nhánh
    
    @NotBlank(message = "PROMOTION_CODE_REQUIRED")
    @Size(min = 3, max = 50, message = "CODE_LENGTH")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "CODE_PATTERN")
    String code;
    
    @NotBlank(message = "PROMOTION_NAME_REQUIRED")
    @Size(max = 200, message = "NAME_LENGTH")
    String name;
    
    @NotNull(message = "START_DATE_REQUIRED")
    LocalDate startDate;
    
    @NotNull(message = "END_DATE_REQUIRED")
    LocalDate endDate;
    
    Boolean active;
    
    @NotNull(message = "DISCOUNT_TYPE_REQUIRED")
    Promotion.DiscountType discountType;
    
    @DecimalMin(value = "0.0", message = "PERCENT_OFF_MIN")
    @DecimalMax(value = "100.0", message = "PERCENT_OFF_MAX")
    BigDecimal percentOff; // % giảm giá (0-100)
    
    @DecimalMin(value = "0.0", message = "AMOUNT_OFF_MIN")
    BigDecimal amountOff; // Số tiền giảm cố định
    
    @DecimalMin(value = "0.0", message = "MIN_BOOKING_AMOUNT_MIN")
    BigDecimal minBookingAmount; // Giá trị đơn hàng tối thiểu
    
    @Min(value = 1, message = "MIN_NIGHTS_MIN")
    Integer minNights; // Số đêm tối thiểu
    
    @Min(value = 1, message = "USAGE_LIMIT_MIN")
    Integer usageLimit; // Giới hạn số lần sử dụng (null = unlimited)
    
    @DecimalMin(value = "0.0", message = "MAX_DISCOUNT_AMOUNT_MIN")
    BigDecimal maxDiscountAmount; // Giảm tối đa (cho trường hợp %)
    
    Set<String> applicableRoomTypeIds; // Danh sách room type IDs (null hoặc empty = tất cả)
    
    Boolean stackable; // Có thể kết hợp với promotion khác không
    
    Boolean exclusiveWithOthers; // Không thể dùng cùng promotion khác
    
    @Size(max = 1000, message = "DESCRIPTION_LENGTH")
    String description;
    
    @Size(max = 2000, message = "TERMS_LENGTH")
    String termsAndConditions; // Điều khoản và điều kiện
    
    @Min(value = 0, message = "PRIORITY_MIN")
    Integer priority; // Priority (higher number = higher priority)
}

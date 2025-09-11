package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreationRequest {
    @NotBlank(message = "BOOKING_ID_REQUIRED")
    String bookingId;
    
    @NotBlank(message = "PAYMENT_METHOD_REQUIRED")
    String method;
    
    @NotBlank(message = "PAYMENT_STATUS_REQUIRED")
    String status;
    
    @NotNull(message = "PAYMENT_AMOUNT_REQUIRED")
    @Positive(message = "PAYMENT_AMOUNT_POSITIVE")
    Double amount;
    
    String providerTxnId;
}

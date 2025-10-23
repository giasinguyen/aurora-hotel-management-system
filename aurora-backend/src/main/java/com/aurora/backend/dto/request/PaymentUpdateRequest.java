package com.aurora.backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentUpdateRequest {
    String status;
    
    @Positive(message = "PAYMENT_AMOUNT_POSITIVE")
    Double amount;
    
    String providerTxnId;
}

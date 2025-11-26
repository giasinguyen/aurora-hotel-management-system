package com.aurora.backend.repository.projection;

import com.aurora.backend.entity.Payment;

import java.math.BigDecimal;

public interface PaymentMethodRevenueProjection {
    Payment.PaymentMethod getMethod();
    BigDecimal getTotalAmount();
}


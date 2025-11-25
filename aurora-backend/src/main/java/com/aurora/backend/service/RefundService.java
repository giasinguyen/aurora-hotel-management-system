package com.aurora.backend.service;

import com.aurora.backend.entity.Booking;

import java.math.BigDecimal;
public interface RefundService {
    
    /**
     * Calculate refund amount based on cancellation policy
     * - > 7 days before checkin: 100% refund
     * - 3-7 days before checkin: 50% refund
     * - < 3 days before checkin: 0% refund
     * 
     */
    BigDecimal calculateRefundAmount(Booking booking);
    int getRefundPercentage(long daysUntilCheckin);
    String getRefundPolicyExplanation(long daysUntilCheckin);
    void processRefund(Booking booking, BigDecimal refundAmount);
}

package com.aurora.backend.service.impl;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RefundServiceImpl implements RefundService {
    
    @Override
    public BigDecimal calculateRefundAmount(Booking booking) {
        if (booking.getTotalPrice() == null) {
            return BigDecimal.ZERO;
        }
        
        long daysUntilCheckin = ChronoUnit.DAYS.between(LocalDate.now(), booking.getCheckin());
        int refundPercentage = getRefundPercentage(daysUntilCheckin);
        
        return booking.getTotalPrice()
                .multiply(BigDecimal.valueOf(refundPercentage))
                .divide(BigDecimal.valueOf(100));
    }
    
    @Override
    public int getRefundPercentage(long daysUntilCheckin) {
        if (daysUntilCheckin > 7) {
            return 100; // Full refund
        } else if (daysUntilCheckin >= 3) {
            return 50;  // 50% refund
        } else {
            return 0;   // No refund
        }
    }
    
    @Override
    public String getRefundPolicyExplanation(long daysUntilCheckin) {
        if (daysUntilCheckin > 7) {
            return "Full refund - Cancelled more than 7 days before check-in";
        } else if (daysUntilCheckin >= 3) {
            return "50% refund - Cancelled 3-7 days before check-in";
        } else {
            return "No refund - Cancelled less than 3 days before check-in";
        }
    }
    
    @Override
    @Transactional
    public void processRefund(Booking booking, BigDecimal refundAmount) {
        // Update payment status to REFUNDED if full refund
        if (refundAmount.compareTo(booking.getTotalPrice()) == 0) {
            booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);
        }
        
        
        log.info("Refund processed for booking {}: {} VND", booking.getBookingCode(), refundAmount);
    }
}

package com.aurora.backend.service.impl;

import com.aurora.backend.entity.*;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.service.PriceCalculationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;


@Service
@Slf4j
@Transactional(readOnly = true)
public class PriceCalculationServiceImpl implements PriceCalculationService {
    
    @Override
    public BigDecimal calculateBookingTotal(Booking booking) {
        log.debug("Calculating total for booking: {}", booking.getId());
        
        // 1. Calculate room prices
        BigDecimal roomsTotal = booking.getRooms().stream()
            .map(br -> calculateBookingRoomTotal(br, booking.getCheckin(), booking.getCheckout()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        log.debug("Rooms total: {}", roomsTotal);
        
        // 2. Subtotal (before discount)
        BigDecimal subtotal = roomsTotal;
        
        // 3. Apply discount if promotion exists
        BigDecimal discount = BigDecimal.ZERO;
        if (booking.getAppliedPromotion() != null) {
            discount = calculateDiscount(booking.getAppliedPromotion(), subtotal);
            log.debug("Discount applied: {}", discount);
        }
        
        // 4. Final total
        BigDecimal total = subtotal.subtract(discount);
        
        log.info("Booking total calculated: subtotal={}, discount={}, total={}", 
            subtotal, discount, total);
        
        return total;
    }
    
    @Override
    public BigDecimal calculateBookingRoomTotal(BookingRoom bookingRoom, LocalDate checkin, LocalDate checkout) {
        Room room = bookingRoom.getRoom();
        BigDecimal total = BigDecimal.ZERO;
        
        LocalDate current = checkin;
        int nightCount = 0;
        
        while (current.isBefore(checkout)) {
            BigDecimal dailyRate = getDailyRate(room, current);
            total = total.add(dailyRate);
            current = current.plusDays(1);
            nightCount++;
        }
        
        if (bookingRoom.getEarlyCheckinCharge() != null) {
            total = total.add(bookingRoom.getEarlyCheckinCharge());
        }
        
        if (bookingRoom.getLateCheckoutCharge() != null) {
            total = total.add(bookingRoom.getLateCheckoutCharge());
        }
        
        log.debug("BookingRoom total: room={}, nights={}, total={}", 
            room.getRoomNumber(), nightCount, total);
        
        return total;
    }
    
    @Override
    public BigDecimal getDailyRate(Room room, LocalDate date) {
        // Calculate display price from room's basePrice and salePercent
        BigDecimal basePrice = room.getBasePrice();
        BigDecimal salePercent = room.getSalePercent() != null ? room.getSalePercent() : BigDecimal.ZERO;
        
        // displayPrice = basePrice * (100 - salePercent) / 100
        BigDecimal displayPrice = basePrice
            .multiply(new BigDecimal("100").subtract(salePercent))
            .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        
        log.debug("Daily rate for room {}: basePrice={}, salePercent={}%, displayPrice={}", 
            room.getRoomNumber(), basePrice, salePercent, displayPrice);
        
        return displayPrice;
    }
    
    @Override
    public BigDecimal calculateDiscount(Promotion promotion, BigDecimal subtotal) {
        if (promotion == null || subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal discount = BigDecimal.ZERO;
        
        if (promotion.getDiscountType() == Promotion.DiscountType.PERCENTAGE) {
            discount = subtotal
                .multiply(promotion.getPercentOff())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            
            if (promotion.getMaxDiscountAmount() != null
                && discount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
                discount = promotion.getMaxDiscountAmount();
                log.debug("Discount capped at max amount: {}", discount);
            }
        } else if (promotion.getDiscountType() == Promotion.DiscountType.FIXED_AMOUNT) {
            discount = promotion.getAmountOff();
            
            if (discount.compareTo(subtotal) > 0) {
                discount = subtotal;
                log.debug("Discount adjusted to subtotal: {}", discount);
            }
        }
        
        log.info("Discount calculated: type={}, subtotal={}, discount={}", 
            promotion.getDiscountType(), subtotal, discount);
        
        return discount;
    }
    
    @Override
    public BigDecimal calculateRefundAmount(Booking booking, LocalDate cancellationDate) {
        LocalDate checkin = booking.getCheckin();
        long daysUntilCheckin = ChronoUnit.DAYS.between(cancellationDate, checkin);
        
        BigDecimal totalPrice = booking.getTotalPrice();
        if (totalPrice == null) {
            return BigDecimal.ZERO;
        }
        
        // Cancellation policy (configurable)
        BigDecimal refundPercentage;
        
        if (daysUntilCheckin >= 30) {
            refundPercentage = new BigDecimal("1.00"); // 100% refund
        } else if (daysUntilCheckin >= 14) {
            refundPercentage = new BigDecimal("0.75"); // 75% refund
        } else if (daysUntilCheckin >= 7) {
            refundPercentage = new BigDecimal("0.50"); // 50% refund
        } else if (daysUntilCheckin >= 3) {
            refundPercentage = new BigDecimal("0.25"); // 25% refund
        } else {
            refundPercentage = BigDecimal.ZERO; // No refund
        }
        
        BigDecimal refundAmount = totalPrice.multiply(refundPercentage);
        
        log.info("Refund calculated: daysUntilCheckin={}, refund%={}, amount={}", 
            daysUntilCheckin, refundPercentage, refundAmount);
        
        return refundAmount;
    }
    
    @Override
    public void validateBookingTotal(Booking booking, BigDecimal expectedTotal) {
        BigDecimal calculatedTotal = calculateBookingTotal(booking);
        
        BigDecimal difference = calculatedTotal.subtract(expectedTotal).abs();
        
        if (difference.compareTo(new BigDecimal("1.00")) > 0) {
            log.error("Price validation failed: calculated={}, expected={}, difference={}", 
                calculatedTotal, expectedTotal, difference);
            throw new AppException(ErrorCode.PRICE_MISMATCH);
        }
        
        log.debug("Price validation passed: calculated={}, expected={}", 
            calculatedTotal, expectedTotal);
    }
}

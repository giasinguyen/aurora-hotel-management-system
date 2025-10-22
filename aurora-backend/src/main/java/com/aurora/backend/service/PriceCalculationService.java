package com.aurora.backend.service;

import com.aurora.backend.entity.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

/**
 * Service for calculating prices, discounts, and totals
 * CRITICAL: All price calculations must go through this service
 * to ensure consistency and prevent client-side manipulation
 */
public interface PriceCalculationService {
    
    /**
     * Calculate total price for a booking including all rooms and services
     * Formula: Σ(room totals) + Σ(service totals) - discount
     */
    BigDecimal calculateBookingTotal(Booking booking);
    
    /**
     * Calculate total for a single booking room
     * Formula: Σ(daily rates) + early checkin charge + late checkout charge
     */
    BigDecimal calculateBookingRoomTotal(BookingRoom bookingRoom, LocalDate checkin, LocalDate checkout);
    
    /**
     * Get the applicable daily rate for a room on a specific date
     * Priority: room.priceOverride > holiday price > weekend price > base price
     */
    BigDecimal getDailyRate(Room room, LocalDate date);
    
    /**
     * Calculate discount amount from promotion
     * Handles both percentage and fixed amount discounts
     */
    BigDecimal calculateDiscount(Promotion promotion, BigDecimal subtotal);
    
    /**
     * Calculate refund amount based on cancellation policy
     * Returns amount to refund based on days until check-in
     */
    BigDecimal calculateRefundAmount(Booking booking, LocalDate cancellationDate);
    
    /**
     * Validate that calculated total matches expected total
     * Throws exception if mismatch detected
     */
    void validateBookingTotal(Booking booking, BigDecimal expectedTotal);
}

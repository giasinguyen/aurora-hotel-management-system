package com.aurora.backend.service;

import com.aurora.backend.entity.Booking;

public interface EmailService {
    /**
     * Send booking confirmation email to customer
     * @param booking The booking entity with all details
     */
    void sendBookingConfirmation(Booking booking);
}

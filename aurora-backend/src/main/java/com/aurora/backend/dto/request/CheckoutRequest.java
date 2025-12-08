package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for complete checkout process
 * Includes booking info, rooms, and services
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutRequest {
    
    @NotBlank(message = "BRANCH_ID_REQUIRED")
    String branchId;
    
    // Customer ID is optional - null for walk-in guests
    String customerId;
    
    // Guest information (required if customerId is null)
    String guestFullName;
    String guestEmail;
    String guestPhone;
    
    @NotNull(message = "CHECKIN_REQUIRED")
    LocalDate checkIn;
    
    @NotNull(message = "CHECKOUT_REQUIRED")
    LocalDate checkOut;
    
    @NotNull(message = "GUESTS_REQUIRED")
    Integer guests;
    
    @NotNull(message = "NIGHTS_REQUIRED")
    Integer nights;
    
    // Special requests from step 3
    String specialRequests;
    
    // Payment method
    @NotBlank(message = "PAYMENT_METHOD_REQUIRED")
    String paymentMethod; // "cash", "vnpay", "momo", "visa"
    
    // Payment confirmation - only create booking if payment is successful
    @NotNull(message = "PAYMENT_SUCCESS_REQUIRED")
    Boolean paymentSuccess; // true = payment successful, false = payment failed
    
    // Promotion ID (optional)
    String promotionId; // ID of applied promotion
    
    // Rooms with notes
    @NotNull(message = "ROOMS_REQUIRED")
    List<RoomBookingRequest> rooms;
    
    // Services per room
    List<ServiceBookingRequest> services;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RoomBookingRequest {
        @NotBlank(message = "ROOM_ID_REQUIRED")
        String roomId;
        
        @NotNull(message = "PRICE_PER_NIGHT_REQUIRED")
        Double pricePerNight;
        
        String roomNotes; // Note from step 2
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ServiceBookingRequest {
        @NotBlank(message = "SERVICE_ID_REQUIRED")
        String serviceId;
        
        @NotBlank(message = "ROOM_ID_REQUIRED")
        String roomId; // Which room this service is for
        
        @NotNull(message = "QUANTITY_REQUIRED")
        Integer quantity;
        
        @NotNull(message = "PRICE_REQUIRED")
        Double price;
    }
}


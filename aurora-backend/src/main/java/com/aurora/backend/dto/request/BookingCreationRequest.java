package com.aurora.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingCreationRequest {
    @NotBlank(message = "BOOKING_CODE_REQUIRED")
    String bookingCode;
    
    @NotBlank(message = "HOTEL_ID_REQUIRED")
    String hotelId;
    
    @NotBlank(message = "CUSTOMER_ID_REQUIRED")
    String customerId;
    
    @NotNull(message = "BOOKING_DATE_REQUIRED")
    @Future(message = "CHECKIN_DATE_FUTURE")
    LocalDate checkin;
    
    @NotNull(message = "BOOKING_DATE_REQUIRED")
    @Future(message = "CHECKOUT_DATE_FUTURE")
    LocalDate checkout;
    
    Double totalPrice;
    String status;
    String paymentStatus;
    String specialRequest;
}

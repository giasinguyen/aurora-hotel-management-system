package com.aurora.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "booking_rooms",
       uniqueConstraints = @UniqueConstraint(columnNames = {"booking_id", "room_id"}),
       indexes = {
           @Index(name = "idx_booking_room_booking", columnList = "booking_id"),
           @Index(name = "idx_booking_room_room", columnList = "room_id")
       })
public class BookingRoom extends BaseEntity {

    @NotNull(message = "Booking is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    Booking booking;

    @NotNull(message = "Room is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    Room room;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per night must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal pricePerNight;   // Snapshot giá tại thời điểm đặt
    
    @NotNull(message = "Number of nights is required")
    @Min(value = 1, message = "Number of nights must be at least 1")
    @Column(nullable = false)
    Integer nights;
    
    @Min(value = 0, message = "Number of adults cannot be negative")
    Integer actualAdults;
    
    @Min(value = 0, message = "Number of children cannot be negative")
    Integer actualChildren;
    
    @DecimalMin(value = "0.0", message = "Early checkin charge cannot be negative")
    @Column(precision = 8, scale = 2)
    BigDecimal earlyCheckinCharge; // Phụ thu check-in sớm
    
    @DecimalMin(value = "0.0", message = "Late checkout charge cannot be negative")
    @Column(precision = 8, scale = 2)
    BigDecimal lateCheckoutCharge; // Phụ thu check-out muộn
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount cannot be negative")
    @Column(precision = 10, scale = 2)
    BigDecimal totalAmount; // Tổng tiền cho phòng này (calculated: pricePerNight * nights + charges)
    
    @Column(length = 500)
    String guestNames;
    
    @Column(length = 500)
    String roomNotes;
}

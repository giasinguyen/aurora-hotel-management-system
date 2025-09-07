package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(indexes = {
        @Index(columnList = "hotel_id"),
        @Index(columnList = "customer_id"),
        @Index(columnList = "checkin,checkout")
})
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, unique = true)
    String bookingCode;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    User customer;

    @Column(nullable = false)
    LocalDate checkin;
    @Column(nullable = false)
    LocalDate checkout;

    Double totalPrice;   // tổng tiền sau promo + services
    String status;       // PENDING, CONFIRMED, CHECKED_IN, COMPLETED, CANCELED
    String paymentStatus;
    String specialRequest;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<BookingRoom> rooms;
}

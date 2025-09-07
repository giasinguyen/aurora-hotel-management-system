package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(indexes = @Index(columnList = "booking_id"))
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    Booking booking;

    @Column(nullable = false)
    String method;   // CASH, CARD, BANK_TRANSFER, E_WALLET
    @Column(nullable = false)
    String status;   // PENDING, SUCCESS, FAILED, REFUNDED
    @Column(nullable = false)
    Double amount;

    String providerTxnId;   // mã từ VNPay/MoMo...
    Instant paidAt;
}

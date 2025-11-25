package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_locks", indexes = {
        @Index(name = "idx_room_lock_room_dates", columnList = "room_id, checkin_date, checkout_date"),
        @Index(name = "idx_room_lock_expires_at", columnList = "expires_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomLock extends BaseEntity {


    @Column(name = "lock_token", nullable = false, unique = true, length = 100)
    private String lockToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "checkin_date", nullable = false)
    private LocalDate checkinDate;

    @Column(name = "checkout_date", nullable = false)
    private LocalDate checkoutDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by", nullable = false)
    private User lockedBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    @Builder.Default
    private LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

    @Column(name = "released", nullable = false)
    @Builder.Default
    private Boolean released = false;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "booking_id")
    private String bookingId;
}

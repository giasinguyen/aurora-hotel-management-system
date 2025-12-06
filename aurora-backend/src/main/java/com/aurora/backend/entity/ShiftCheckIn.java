package com.aurora.backend.entity;

import com.aurora.backend.enums.CheckInStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.Duration;

/**
 * ShiftCheckIn records staff check-in and check-out for their assigned shifts
 * Used for attendance tracking and working hours calculation
 */
@Entity
@Table(name = "shift_check_ins",
    indexes = {
        @Index(name = "idx_checkin_assignment", columnList = "assignment_id"),
        @Index(name = "idx_checkin_staff_date", columnList = "staff_id, check_in_time")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftCheckIn extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assignment_id", nullable = false)
    StaffShiftAssignment assignment; // Link to shift assignment
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_id", nullable = false)
    User staff;
    
    @Column(name = "check_in_time", nullable = false)
    LocalDateTime checkInTime; // Actual check-in timestamp
    
    @Column(name = "check_out_time")
    LocalDateTime checkOutTime; // Actual check-out timestamp
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    CheckInStatus status = CheckInStatus.CHECKED_IN; // CHECKED_IN, CHECKED_OUT, LATE, EARLY_DEPARTURE
    
    @Column(name = "ip_address", length = 50)
    String ipAddress; // For security/audit
    
    @Column(name = "device_info", length = 255)
    String deviceInfo; // Browser/device information
    
    @Column(length = 255)
    String location; // Check-in/out location
    
    @Column(length = 500)
    String notes; // Staff notes or reasons for late/early
    
    @Column(name = "is_late")
    @Builder.Default
    Boolean isLate = false; // Check-in after shift start time
    
    @Column(name = "is_early_departure")
    @Builder.Default
    Boolean isEarlyDeparture = false; // Check-out before shift end time
    
    @Column(name = "late_minutes")
    @Builder.Default
    Integer lateMinutes = 0; // Minutes late
    
    @Column(name = "early_departure_minutes")
    @Builder.Default
    Integer earlyDepartureMinutes = 0; // Minutes early
    
    /**
     * Calculate actual working hours
     */
    public double getWorkingHours() {
        if (checkOutTime == null) {
            return 0.0;
        }
        Duration duration = Duration.between(checkInTime, checkOutTime);
        return duration.toMinutes() / 60.0;
    }
    
    /**
     * Check if still checked in (not checked out yet)
     */
    public boolean isCurrentlyCheckedIn() {
        return checkOutTime == null && status == CheckInStatus.CHECKED_IN;
    }
}

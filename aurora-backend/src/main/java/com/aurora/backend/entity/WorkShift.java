package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

/**
 * WorkShift entity represents predefined work shifts (e.g., Morning, Afternoon, Evening)
 * Managers can configure multiple shift templates with time ranges
 */
@Entity
@Table(name = "work_shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkShift extends BaseEntity {
    
    @Column(nullable = false, unique = true, length = 100)
    String name; // e.g., "Morning Shift", "Afternoon Shift", "Evening Shift"
    
    @Column(length = 500)
    String description;
    
    @Column(name = "start_time", nullable = false)
    LocalTime startTime; // e.g., 08:00
    
    @Column(name = "end_time", nullable = false)
    LocalTime endTime; // e.g., 12:00
    
    @Column(name = "color_code", length = 7)
    String colorCode; // For UI calendar display, e.g., "#FF5733"
    
    @Column(nullable = false)
    @Builder.Default
    Boolean active = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    Branch branch; // Shift can be branch-specific or null for all branches
    
    /**
     * Check if current time is within shift time range
     */
    public boolean isWithinShiftTime(LocalTime currentTime) {
        return !currentTime.isBefore(startTime) && !currentTime.isAfter(endTime);
    }
    
    /**
     * Get shift duration in hours
     */
    public double getDurationInHours() {
        int hours = endTime.getHour() - startTime.getHour();
        int minutes = endTime.getMinute() - startTime.getMinute();
        return hours + (minutes / 60.0);
    }
}

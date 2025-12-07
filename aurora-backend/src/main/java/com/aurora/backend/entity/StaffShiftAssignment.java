package com.aurora.backend.entity;

import com.aurora.backend.enums.ShiftAssignmentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

/**
 * StaffShiftAssignment represents the assignment of a work shift to a staff member on a specific date
 * Managers use this to schedule staff work hours
 */
@Entity
@Table(name = "staff_shift_assignments", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "shift_date", "work_shift_id"}),
    indexes = {
        @Index(name = "idx_shift_assignment_user_date", columnList = "user_id, shift_date"),
        @Index(name = "idx_shift_assignment_date_status", columnList = "shift_date, status")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffShiftAssignment extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    User staff; // The staff member assigned to this shift
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_shift_id", nullable = false)
    WorkShift workShift; // The shift template (Morning, Afternoon, etc.)
    
    @Column(name = "shift_date", nullable = false)
    LocalDate shiftDate; // The specific date for this assignment
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    Branch branch; // Branch where staff works this shift
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    ShiftAssignmentStatus status = ShiftAssignmentStatus.SCHEDULED; // SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    
    @Column(length = 500)
    String notes; // Manager notes or instructions
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by")
    User assignedBy; // Manager who created this assignment
    
    @Column(name = "cancelled_reason", length = 500)
    String cancelledReason;
    
    /**
     * Check if this shift is active today and within time range
     */
    public boolean isActiveNow() {
        LocalDate today = LocalDate.now();
        return shiftDate.equals(today) 
            && (status == ShiftAssignmentStatus.SCHEDULED || status == ShiftAssignmentStatus.IN_PROGRESS)
            && workShift.getActive()
            && workShift.isWithinShiftTime(java.time.LocalTime.now());
    }
}

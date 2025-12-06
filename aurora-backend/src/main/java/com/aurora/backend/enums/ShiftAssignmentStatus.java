package com.aurora.backend.enums;

/**
 * Status of a staff shift assignment
 */
public enum ShiftAssignmentStatus {
    SCHEDULED,      // Shift is scheduled and active
    COMPLETED,      // Shift has been completed (staff checked in and out)
    CANCELLED,      // Shift was cancelled by manager
    NO_SHOW,        // Staff didn't show up for the shift
    IN_PROGRESS     // Staff has checked in but not checked out yet
}

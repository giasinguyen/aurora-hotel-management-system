package com.aurora.backend.enums;

/**
 * Status of shift check-in/check-out
 */
public enum CheckInStatus {
    CHECKED_IN,         // Staff has checked in, not yet checked out
    CHECKED_OUT,        // Staff has checked out normally
    LATE,               // Checked in late
    EARLY_DEPARTURE,    // Checked out early
    ABSENT              // Didn't check in at all
}

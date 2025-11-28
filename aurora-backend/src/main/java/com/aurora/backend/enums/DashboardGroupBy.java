package com.aurora.backend.enums;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.Locale;

public enum DashboardGroupBy {
    DAY,
    WEEK,
    MONTH,
    YEAR;

    public static DashboardGroupBy from(String value) {
        if (value == null || value.isBlank()) {
            return DAY;
        }
        try {
            return DashboardGroupBy.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return DAY;
        }
    }

    public LocalDate normalize(LocalDate date) {
        return switch (this) {
            case DAY -> date;
            case WEEK -> date.with(WeekFields.of(Locale.getDefault()).dayOfWeek(), 1);
            case MONTH -> date.with(TemporalAdjusters.firstDayOfMonth());
            case YEAR -> date.with(TemporalAdjusters.firstDayOfYear());
        };
    }
}


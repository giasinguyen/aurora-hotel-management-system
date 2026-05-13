package com.aurora.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Fixes the bookings.status CHECK constraint after Hibernate DDL runs.
 *
 * Problem: Hibernate 6 auto-generates a CHECK constraint for @Enumerated(EnumType.STRING)
 * columns when the table is first created. ddl-auto: update does NOT modify existing
 * check constraints when new enum values are added.
 *
 * When AWAITING_PAYMENT was added to BookingStatus, the existing constraint still only
 * allowed the original values → INSERT with AWAITING_PAYMENT violated the constraint.
 *
 * This runner runs after Hibernate DDL completes (ApplicationRunner fires post-context-init),
 * finds any outdated check constraints on bookings.status that don't include AWAITING_PAYMENT,
 * drops them, and recreates the constraint with all current enum values.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookingStatusConstraintMigration implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            log.info(">>> [Migration] Checking bookings.status check constraint...");

            // Find all check constraints on the bookings table that reference 'status'
            // but do NOT yet include AWAITING_PAYMENT (i.e., are outdated)
            List<String> outdatedConstraints = jdbcTemplate.queryForList(
                "SELECT con.conname " +
                "FROM pg_constraint con " +
                "JOIN pg_class rel ON rel.oid = con.conrelid " +
                "WHERE rel.relname = 'bookings' " +
                "  AND con.contype = 'c' " +
                "  AND pg_get_constraintdef(con.oid) LIKE '%status%' " +
                "  AND pg_get_constraintdef(con.oid) NOT LIKE '%AWAITING_PAYMENT%'",
                String.class
            );

            if (outdatedConstraints.isEmpty()) {
                log.info(">>> [Migration] bookings.status constraint is already up-to-date.");
                return;
            }

            for (String constraintName : outdatedConstraints) {
                log.info(">>> [Migration] Dropping outdated constraint: {}", constraintName);
                jdbcTemplate.execute(
                    "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS \"" + constraintName + "\""
                );
            }

            // Drop our named constraint in case it was created in a previous migration run
            jdbcTemplate.execute(
                "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check"
            );

            // Recreate with all current BookingStatus enum values
            jdbcTemplate.execute(
                "ALTER TABLE bookings ADD CONSTRAINT bookings_status_check " +
                "CHECK (status IN (" +
                "  'AWAITING_PAYMENT'," +
                "  'PENDING'," +
                "  'CONFIRMED'," +
                "  'CHECKED_IN'," +
                "  'CHECKED_OUT'," +
                "  'COMPLETED'," +
                "  'CANCELLED'," +
                "  'NO_SHOW'" +
                "))"
            );

            log.info(">>> [Migration] bookings.status constraint updated successfully.");

        } catch (Exception e) {
            log.error(">>> [Migration] Failed to update bookings.status constraint: {}", e.getMessage(), e);
            // Do NOT rethrow — a failed migration should not crash the app.
            // The constraint fix is best-effort; the old constraint may still reject AWAITING_PAYMENT.
        }
    }
}

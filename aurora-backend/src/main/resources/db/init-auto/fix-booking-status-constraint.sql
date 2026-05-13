-- Fix: Drop old check constraint on bookings.status and recreate with AWAITING_PAYMENT
-- Hibernate 6 generates check constraints for @Enumerated(EnumType.STRING) columns.
-- When AWAITING_PAYMENT was added to BookingStatus enum, the existing constraint was not updated.
-- This script drops the old constraint and recreates it with the new enum value.

DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the check constraint on bookings.status column
    SELECT con.conname
    INTO constraint_name
    FROM pg_constraint con
    INNER JOIN pg_class rel ON rel.oid = con.conrelid
    INNER JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
    WHERE rel.relname = 'bookings'
      AND att.attname = 'status'
      AND con.contype = 'c'
    LIMIT 1;

    -- Drop the old constraint if found
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END IF;
END $$;

-- Recreate constraint with AWAITING_PAYMENT included
ALTER TABLE bookings
    DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings
    ADD CONSTRAINT bookings_status_check
    CHECK (status IN (
        'AWAITING_PAYMENT',
        'PENDING',
        'CONFIRMED',
        'CHECKED_IN',
        'CHECKED_OUT',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW'
    ));

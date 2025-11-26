-- Fix existing users table to add email_verified column with default value
-- Run this script manually in PostgreSQL before starting the application

-- Step 1: Add column as nullable first
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN;

-- Step 2: Set default value for existing records
UPDATE users SET email_verified = false WHERE email_verified IS NULL;

-- Step 3: Make it NOT NULL (Hibernate will handle this on next startup)
ALTER TABLE users ALTER COLUMN email_verified SET NOT NULL;
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;

-- Verify the change
SELECT id, username, email, email_verified FROM users LIMIT 10;

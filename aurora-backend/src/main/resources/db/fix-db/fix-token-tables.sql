-- Fix password_reset_tokens table - Change id from BIGINT to VARCHAR(255)
-- Drop existing table and recreate with correct schema

DROP TABLE IF EXISTS password_reset_tokens CASCADE;

CREATE TABLE password_reset_tokens (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(100) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP(6) NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(6) NOT NULL,
    used_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6) NOT NULL,
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_reset_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_reset_user_id ON password_reset_tokens(user_id);

-- Fix email_verification_tokens table - Change id from BIGINT to VARCHAR(255)
DROP TABLE IF EXISTS email_verification_tokens CASCADE;

CREATE TABLE email_verification_tokens (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(100) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP(6) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(6) NOT NULL,
    verified_at TIMESTAMP(6),
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6) NOT NULL,
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_verification_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_verification_token ON email_verification_tokens(token);
CREATE INDEX idx_verification_user_id ON email_verification_tokens(user_id);

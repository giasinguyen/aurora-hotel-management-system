-- Reset admin password to "password123"
-- BCrypt hash with strength 10
UPDATE users 
SET password = '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe'
WHERE username = 'admin';

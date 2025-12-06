-- =====================================================
-- Add Shift Management Permissions
-- Aurora Hotel Management System
-- =====================================================

-- Add Shift Permissions
INSERT INTO permissions (id, name, description, created_at, updated_at, version, deleted) VALUES 
(gen_random_uuid(), 'SHIFT_VIEW', 'Xem ca làm việc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SHIFT_CREATE', 'Tạo ca làm việc mới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SHIFT_UPDATE', 'Cập nhật ca làm việc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SHIFT_DELETE', 'Xóa ca làm việc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SHIFT_ASSIGN', 'Phân công ca làm việc cho nhân viên', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SHIFT_CHECKIN', 'Check-in vào ca làm việc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SHIFT_CHECKOUT', 'Check-out khỏi ca làm việc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SHIFT_VIEW_OWN', 'Xem ca làm việc của mình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false)
ON CONFLICT (name) DO NOTHING;

-- Assign SHIFT permissions to STAFF role (own shifts + check-in/out)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'STAFF'
AND p.name IN (
    'SHIFT_VIEW_OWN',
    'SHIFT_CHECKIN',
    'SHIFT_CHECKOUT'
)
ON CONFLICT DO NOTHING;

-- Assign SHIFT permissions to MANAGER role (view all shifts + assign)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'MANAGER'
AND p.name IN (
    'SHIFT_VIEW',
    'SHIFT_ASSIGN',
    'SHIFT_VIEW_OWN',
    'SHIFT_CHECKIN',
    'SHIFT_CHECKOUT'
)
ON CONFLICT DO NOTHING;

-- Assign ALL SHIFT permissions to ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN'
AND p.name IN (
    'SHIFT_VIEW',
    'SHIFT_CREATE',
    'SHIFT_UPDATE',
    'SHIFT_DELETE',
    'SHIFT_ASSIGN',
    'SHIFT_CHECKIN',
    'SHIFT_CHECKOUT',
    'SHIFT_VIEW_OWN'
)
ON CONFLICT DO NOTHING;

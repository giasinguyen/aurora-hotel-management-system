-- =====================================================
-- Script thêm permissions cho Manager và Staff tạo User
-- Aurora Hotel Management System
-- =====================================================

-- BƯỚC 1: Thêm các permissions mới
INSERT INTO permissions (id, name, description, created_at, updated_at, version, deleted)
VALUES 
    (gen_random_uuid(), 'CUSTOMER_CREATE', 'Tạo tài khoản khách hàng mới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
    (gen_random_uuid(), 'STAFF_CREATE', 'Tạo tài khoản nhân viên mới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
    (gen_random_uuid(), 'STAFF_UPDATE', 'Cập nhật thông tin nhân viên', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
    (gen_random_uuid(), 'BRANCH_ASSIGN_STAFF', 'Phân chi nhánh cho nhân viên', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
    (gen_random_uuid(), 'PERMISSION_VIEW', 'Xem danh sách quyền hạn', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false)
ON CONFLICT (name) DO NOTHING;

-- BƯỚC 2: Gán CUSTOMER_CREATE cho role STAFF
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'STAFF'
  AND p.name = 'CUSTOMER_CREATE'
ON CONFLICT DO NOTHING;

-- BƯỚC 3: Gán permissions cho role MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'MANAGER'
  AND p.name IN ('STAFF_CREATE', 'STAFF_UPDATE', 'CUSTOMER_CREATE', 'BRANCH_ASSIGN_STAFF', 'PERMISSION_VIEW')
ON CONFLICT DO NOTHING;

-- Kiểm tra kết quả
SELECT r.name as role_name, p.name as permission_name
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE p.name IN ('CUSTOMER_CREATE', 'STAFF_CREATE', 'STAFF_UPDATE', 'BRANCH_ASSIGN_STAFF', 'PERMISSION_VIEW')
ORDER BY r.name, p.name;

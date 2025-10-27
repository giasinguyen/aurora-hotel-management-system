-- =====================================================
-- Script Khởi Tạo Roles và Permissions
-- Aurora Hotel Management System
-- Version: 2.0 - FULL ATTRIBUTES
-- =====================================================

-- Xóa dữ liệu cũ (nếu có) - Đúng thứ tự foreign keys
-- DELETE FROM user_roles;           -- Xóa TẤT CẢ user-role mappings
-- DELETE FROM role_permissions;     -- Xóa role-permission mappings
-- DELETE FROM users WHERE username IN ('admin', 'manager', 'staff', 'customer');  -- Xóa sample users
-- DELETE FROM roles;                -- Xóa roles
-- DELETE FROM permissions;          -- Cuối cùng xóa permissions

-- =====================================================
-- BƯỚC 1: TẠO CÁC PERMISSIONS
-- =====================================================

-- Guest Permissions (Xem thông tin công khai)
INSERT INTO permissions (id, name, description, created_at, updated_at, version, deleted) VALUES 
(gen_random_uuid(), 'BRANCH_VIEW', 'Xem thông tin chi nhánh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROOM_VIEW', 'Xem thông tin phòng và giá', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROOM_SEARCH', 'Tìm kiếm phòng trống', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PROMOTION_VIEW', 'Xem khuyến mãi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SERVICE_VIEW', 'Xem dịch vụ bổ sung', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false);

-- Customer Permissions (Khách hàng đã đăng ký)
INSERT INTO permissions (id, name, description, created_at, updated_at, version, deleted) VALUES 
(gen_random_uuid(), 'BOOKING_CREATE', 'Tạo đặt phòng mới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BOOKING_VIEW_OWN', 'Xem đặt phòng của mình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BOOKING_CANCEL_OWN', 'Hủy đặt phòng của mình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BOOKING_UPDATE_OWN', 'Cập nhật đặt phòng của mình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PAYMENT_CREATE', 'Thực hiện thanh toán', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PAYMENT_VIEW_OWN', 'Xem lịch sử thanh toán của mình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PROFILE_VIEW', 'Xem thông tin cá nhân', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PROFILE_UPDATE', 'Cập nhật thông tin cá nhân', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SERVICE_REGISTER', 'Đăng ký dịch vụ bổ sung', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REVIEW_CREATE', 'Tạo đánh giá cho booking đã hoàn thành', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REVIEW_UPDATE_OWN', 'Cập nhật đánh giá của mình (trong 24h)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REVIEW_DELETE_OWN', 'Xóa đánh giá của mình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false);

-- Staff Permissions (Nhân viên lễ tân)
INSERT INTO permissions (id, name, description, created_at, updated_at, version, deleted) VALUES 
(gen_random_uuid(), 'BOOKING_VIEW_ALL', 'Xem tất cả đặt phòng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BOOKING_CREATE_MANUAL', 'Tạo đặt phòng thủ công', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BOOKING_UPDATE_ALL', 'Cập nhật bất kỳ đặt phòng nào', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BOOKING_CANCEL_ALL', 'Hủy bất kỳ đặt phòng nào', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROOM_STATUS_UPDATE', 'Cập nhật trạng thái phòng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'CHECKIN_PROCESS', 'Xử lý check-in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'CHECKOUT_PROCESS', 'Xử lý check-out', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'CUSTOMER_VIEW', 'Xem thông tin khách hàng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PAYMENT_VIEW_ALL', 'Xem tất cả thanh toán', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SERVICE_MANAGE', 'Quản lý dịch vụ bổ sung', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REVIEW_VIEW_ALL', 'Xem tất cả đánh giá', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false);

-- Manager Permissions (Quản lý)
INSERT INTO permissions (id, name, description, created_at, updated_at, version, deleted) VALUES 
(gen_random_uuid(), 'BOOKING_APPROVE', 'Phê duyệt đặt phòng đặc biệt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROOM_CREATE', 'Tạo phòng mới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROOM_UPDATE', 'Cập nhật thông tin phòng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROOM_DELETE', 'Xóa phòng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PRICE_UPDATE', 'Cập nhật giá phòng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PROMOTION_CREATE', 'Tạo khuyến mãi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PROMOTION_UPDATE', 'Cập nhật khuyến mãi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PROMOTION_DELETE', 'Xóa khuyến mãi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(),     'BRANCH_VIEW_STATS', 'Xem thống kê chi nhánh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REPORT_VIEW', 'Xem báo cáo thống kê', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REPORT_EXPORT', 'Xuất báo cáo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'STAFF_VIEW', 'Xem danh sách nhân viên', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REVIEW_MODERATE', 'Phê duyệt/Từ chối đánh giá', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false);

-- Admin Permissions (Quản trị viên hệ thống)
INSERT INTO permissions (id, name, description, created_at, updated_at, version, deleted) VALUES 
(gen_random_uuid(), 'USER_CREATE', 'Tạo tài khoản người dùng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'USER_UPDATE', 'Cập nhật tài khoản người dùng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'USER_DELETE', 'Xóa tài khoản người dùng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'USER_LOCK', 'Khóa/Mở khóa tài khoản', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROLE_ASSIGN', 'Phân quyền cho người dùng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROLE_CREATE', 'Tạo vai trò mới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROLE_UPDATE', 'Cập nhật vai trò', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ROLE_DELETE', 'Xóa vai trò', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'PERMISSION_MANAGE', 'Quản lý quyền hạn', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'SYSTEM_CONFIG', 'Cấu hình hệ thống', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BACKUP_MANAGE', 'Quản lý sao lưu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'LOG_VIEW', 'Xem log hệ thống', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BRANCH_CREATE', 'Tạo chi nhánh mới', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BRANCH_UPDATE', 'Cập nhật chi nhánh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BRANCH_DELETE', 'Xóa chi nhánh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BRANCH_ASSIGN_MANAGER', 'Gán quản lý cho chi nhánh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'BRANCH_REMOVE_MANAGER', 'Gỡ quản lý khỏi chi nhánh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'REVIEW_UPDATE_ALL', 'Cập nhật mọi đánh giá (chỉ Admin)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false);

-- =====================================================
-- BƯỚC 2: TẠO CÁC ROLES
-- =====================================================

INSERT INTO roles (id, name, description, created_at, updated_at, version, deleted) VALUES 
(gen_random_uuid(), 'GUEST', 'Khách chưa đăng nhập - chỉ xem thông tin công khai', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'CUSTOMER', 'Khách hàng đã đăng ký - có thể đặt phòng và sử dụng dịch vụ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'STAFF', 'Nhân viên lễ tân - quản lý đặt phòng và check-in/out', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'MANAGER', 'Quản lý khách sạn - giám sát và điều hành', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false),
(gen_random_uuid(), 'ADMIN', 'Quản trị viên hệ thống - toàn quyền kỹ thuật', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false);

-- =====================================================
-- BƯỚC 3: GÁN PERMISSIONS CHO ROLES
-- =====================================================

-- GUEST Role: Chỉ xem thông tin công khai
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'GUEST'
AND p.name IN (
    'BRANCH_VIEW',
    'ROOM_VIEW',
    'ROOM_SEARCH',
    'PROMOTION_VIEW',
    'SERVICE_VIEW'
);

-- CUSTOMER Role: Kế thừa GUEST + Đặt phòng và quản lý tài khoản
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'CUSTOMER'
AND p.name IN (
    -- Guest permissions
    'BRANCH_VIEW',
    'ROOM_VIEW',
    'ROOM_SEARCH',
    'PROMOTION_VIEW',
    'SERVICE_VIEW',
    -- Customer specific permissions
    'BOOKING_CREATE',
    'BOOKING_VIEW_OWN',
    'BOOKING_CANCEL_OWN',
    'BOOKING_UPDATE_OWN',
    'PAYMENT_CREATE',
    'PAYMENT_VIEW_OWN',
    'PROFILE_VIEW',
    'PROFILE_UPDATE',
    'SERVICE_REGISTER',
    -- Review permissions
    'REVIEW_CREATE',
    'REVIEW_UPDATE_OWN',
    'REVIEW_DELETE_OWN'
);

-- STAFF Role: Kế thừa CUSTOMER + Quản lý đặt phòng và check-in/out
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'STAFF'
AND p.name IN (
    -- Guest + Customer permissions
    'BRANCH_VIEW',
    'ROOM_VIEW',
    'ROOM_SEARCH',
    'PROMOTION_VIEW',
    'SERVICE_VIEW',
    'BOOKING_CREATE',
    'BOOKING_VIEW_OWN',
    'PROFILE_VIEW',
    'PROFILE_UPDATE',
    -- Staff specific permissions
    'BOOKING_VIEW_ALL',
    'BOOKING_CREATE_MANUAL',
    'BOOKING_UPDATE_ALL',
    'BOOKING_CANCEL_ALL',
    'ROOM_STATUS_UPDATE',
    'CHECKIN_PROCESS',
    'CHECKOUT_PROCESS',
    'CUSTOMER_VIEW',
    'PAYMENT_VIEW_ALL',
    'SERVICE_MANAGE',
    -- Review permissions
    'REVIEW_VIEW_ALL'
);

-- MANAGER Role: Kế thừa STAFF + Quản lý chi nhánh và báo cáo
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'MANAGER'
AND p.name IN (
    -- Guest + Customer + Staff permissions
    'BRANCH_VIEW',
    'ROOM_VIEW',
    'ROOM_SEARCH',
    'PROMOTION_VIEW',
    'SERVICE_VIEW',
    'BOOKING_CREATE',
    'BOOKING_VIEW_OWN',
    'PROFILE_VIEW',
    'PROFILE_UPDATE',
    'BOOKING_VIEW_ALL',
    'BOOKING_CREATE_MANUAL',
    'BOOKING_UPDATE_ALL',
    'BOOKING_CANCEL_ALL',
    'ROOM_STATUS_UPDATE',
    'CHECKIN_PROCESS',
    'CHECKOUT_PROCESS',
    'CUSTOMER_VIEW',
    'PAYMENT_VIEW_ALL',
    'SERVICE_MANAGE',
    -- Manager specific permissions
    'BOOKING_APPROVE',
    'ROOM_CREATE',
    'ROOM_UPDATE',
    'ROOM_DELETE',
    'PRICE_UPDATE',
    'PROMOTION_CREATE',
    'PROMOTION_UPDATE',
    'PROMOTION_DELETE',
    'BRANCH_VIEW_STATS',
    'REPORT_VIEW',
    'REPORT_EXPORT',
    'STAFF_VIEW',
    -- Review permissions
    'REVIEW_VIEW_ALL',
    'REVIEW_MODERATE'
);

-- ADMIN Role: Toàn quyền hệ thống
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN';

-- =====================================================
-- BƯỚC 4: TẠO USER MẪU (Optional - WITH FULL ATTRIBUTES)
-- =====================================================

-- Password mẫu: "password123" (hash BCrypt với strength 10)
-- Hash này được tạo từ BCryptPasswordEncoder.encode("password123")
-- Đây là hash THẬT VERIFIED, có thể login được!

-- Admin user (Full attributes)
INSERT INTO users (
    id, username, password, first_name, last_name, dob, phone, email, address,
    avatar_url, assigned_branch_id, active, last_login_at, 
    failed_login_attempts, locked_until, lock_reason,
    created_at, updated_at, version, deleted
)
VALUES (
    gen_random_uuid(),
    'admin',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'System',
    'Administrator',
    '1990-01-01',
    '0900000000',
    'admin@aurorahotel.com',
    'System Office - Aurora Hotel HQ',
    'https://i.pravatar.cc/150?img=33', -- Avatar mẫu
    NULL, -- Admin không thuộc chi nhánh cụ thể
    true, -- Active
    NULL, -- Chưa login lần nào
    0, -- Không có failed attempts
    NULL, -- Không bị khóa
    NULL, -- Không có lý do khóa
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0, -- Version
    false -- Không bị xóa
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN';

-- Manager user (Full attributes - sẽ được assign vào branch sau)
INSERT INTO users (
    id, username, password, first_name, last_name, dob, phone, email, address,
    avatar_url, assigned_branch_id, active, last_login_at, 
    failed_login_attempts, locked_until, lock_reason,
    created_at, updated_at, version, deleted
)
VALUES (
    gen_random_uuid(),
    'manager',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'Hotel',
    'Manager',
    '1985-05-15',
    '0900000001',
    'manager@aurorahotel.com',
    'Hanoi, Vietnam',
    'https://i.pravatar.cc/150?img=12',
    NULL, -- Sẽ được assign sau khi tạo branch
    true,
    NULL,
    0,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    false
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'manager' AND r.name = 'MANAGER';

-- Staff user (Full attributes - sẽ được assign vào branch sau)
INSERT INTO users (
    id, username, password, first_name, last_name, dob, phone, email, address,
    avatar_url, assigned_branch_id, active, last_login_at, 
    failed_login_attempts, locked_until, lock_reason,
    created_at, updated_at, version, deleted
)
VALUES (
    gen_random_uuid(),
    'staff',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'Reception',
    'Staff',
    '1995-08-20',
    '0900000002',
    'staff@aurorahotel.com',
    'Hanoi, Vietnam',
    'https://i.pravatar.cc/150?img=47',
    NULL, -- Sẽ được assign sau khi tạo branch
    true,
    NULL,
    0,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    false
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'staff' AND r.name = 'STAFF';

-- Customer user (Full attributes - không có assigned_branch_id)
INSERT INTO users (
    id, username, password, first_name, last_name, dob, phone, email, address,
    avatar_url, assigned_branch_id, active, last_login_at, 
    failed_login_attempts, locked_until, lock_reason,
    created_at, updated_at, version, deleted
)
VALUES (
    gen_random_uuid(),
    'customer',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'Nguyen Van',
    'A',
    '1992-03-10',
    '0900000003',
    'customer@gmail.com',
    '123 Le Loi, District 1, Ho Chi Minh City, Vietnam',
    'https://i.pravatar.cc/150?img=68',
    NULL, -- Customer không có assigned branch
    true,
    NULL,
    0,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    false
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'customer' AND r.name = 'CUSTOMER';

-- =====================================================
-- HOÀN THÀNH
-- Tổng số Permissions: 54 (bao gồm 6 permissions cho Review System)
-- Tổng số Roles: 5 (GUEST, CUSTOMER, STAFF, MANAGER, ADMIN)
-- Sample Users: 4 (admin, manager, staff, customer)
-- Review System Permissions:
--    - REVIEW_CREATE: Khách hàng tạo đánh giá (CUSTOMER)
--    - REVIEW_UPDATE_OWN: Khách hàng sửa đánh giá của mình (CUSTOMER)
--    - REVIEW_DELETE_OWN: Khách hàng xóa đánh giá của mình (CUSTOMER)
--    - REVIEW_VIEW_ALL: Xem tất cả đánh giá (STAFF, MANAGER, ADMIN)
--    - REVIEW_MODERATE: Phê duyệt/Từ chối đánh giá (MANAGER, ADMIN)
--    - REVIEW_UPDATE_ALL: Cập nhật mọi đánh giá (ADMIN only)

-- LƯU Ý:
-- 1. Chạy script này TRƯỚC khi chạy init-test-data.sql
-- 2. Manager và Staff sẽ được assign vào branch sau khi tạo branches
-- 3. Password mặc định cho tất cả users: "password123"
-- 4. Avatar URLs sử dụng pravatar.cc (service ảnh avatar ngẫu nhiên)
-- 5. Tất cả users đều ACTIVE và chưa bị khóa
-- =====================================================

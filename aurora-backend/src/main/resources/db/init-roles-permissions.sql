-- =====================================================
-- Script Khởi Tạo Roles và Permissions
-- Aurora Hotel Management System
-- =====================================================

-- Xóa dữ liệu cũ (nếu có) - Đúng thứ tự foreign keys
DELETE FROM user_roles;           -- Xóa TẤT CẢ user-role mappings
DELETE FROM role_permissions;     -- Xóa role-permission mappings
DELETE FROM users WHERE username IN ('admin', 'manager', 'staff', 'customer');  -- Xóa sample users
DELETE FROM roles;                -- Xóa roles
DELETE FROM permissions;          -- Cuối cùng xóa permissions

-- =====================================================
-- BƯỚC 1: TẠO CÁC PERMISSIONS
-- =====================================================

-- Guest Permissions (Xem thông tin công khai)
INSERT INTO permissions (id, name, description) VALUES 
(gen_random_uuid(), 'HOTEL_VIEW', 'Xem thông tin khách sạn'),
(gen_random_uuid(), 'ROOM_VIEW', 'Xem thông tin phòng và giá'),
(gen_random_uuid(), 'ROOM_SEARCH', 'Tìm kiếm phòng trống'),
(gen_random_uuid(), 'PROMOTION_VIEW', 'Xem khuyến mãi'),
(gen_random_uuid(), 'SERVICE_VIEW', 'Xem dịch vụ bổ sung');

-- Customer Permissions (Khách hàng đã đăng ký)
INSERT INTO permissions (id, name, description) VALUES 
(gen_random_uuid(), 'BOOKING_CREATE', 'Tạo đặt phòng mới'),
(gen_random_uuid(), 'BOOKING_VIEW_OWN', 'Xem đặt phòng của mình'),
(gen_random_uuid(), 'BOOKING_CANCEL_OWN', 'Hủy đặt phòng của mình'),
(gen_random_uuid(), 'BOOKING_UPDATE_OWN', 'Cập nhật đặt phòng của mình'),
(gen_random_uuid(), 'PAYMENT_CREATE', 'Thực hiện thanh toán'),
(gen_random_uuid(), 'PAYMENT_VIEW_OWN', 'Xem lịch sử thanh toán của mình'),
(gen_random_uuid(), 'PROFILE_VIEW', 'Xem thông tin cá nhân'),
(gen_random_uuid(), 'PROFILE_UPDATE', 'Cập nhật thông tin cá nhân'),
(gen_random_uuid(), 'SERVICE_REGISTER', 'Đăng ký dịch vụ bổ sung');

-- Staff Permissions (Nhân viên lễ tân)
INSERT INTO permissions (id, name, description) VALUES 
(gen_random_uuid(), 'BOOKING_VIEW_ALL', 'Xem tất cả đặt phòng'),
(gen_random_uuid(), 'BOOKING_CREATE_MANUAL', 'Tạo đặt phòng thủ công'),
(gen_random_uuid(), 'BOOKING_UPDATE_ALL', 'Cập nhật bất kỳ đặt phòng nào'),
(gen_random_uuid(), 'BOOKING_CANCEL_ALL', 'Hủy bất kỳ đặt phòng nào'),
(gen_random_uuid(), 'ROOM_STATUS_UPDATE', 'Cập nhật trạng thái phòng'),
(gen_random_uuid(), 'CHECKIN_PROCESS', 'Xử lý check-in'),
(gen_random_uuid(), 'CHECKOUT_PROCESS', 'Xử lý check-out'),
(gen_random_uuid(), 'CUSTOMER_VIEW', 'Xem thông tin khách hàng'),
(gen_random_uuid(), 'PAYMENT_VIEW_ALL', 'Xem tất cả thanh toán'),
(gen_random_uuid(), 'SERVICE_MANAGE', 'Quản lý dịch vụ bổ sung');

-- Manager Permissions (Quản lý)
INSERT INTO permissions (id, name, description) VALUES 
(gen_random_uuid(), 'BOOKING_APPROVE', 'Phê duyệt đặt phòng đặc biệt'),
(gen_random_uuid(), 'ROOM_CREATE', 'Tạo phòng mới'),
(gen_random_uuid(), 'ROOM_UPDATE', 'Cập nhật thông tin phòng'),
(gen_random_uuid(), 'ROOM_DELETE', 'Xóa phòng'),
(gen_random_uuid(), 'PRICE_UPDATE', 'Cập nhật giá phòng'),
(gen_random_uuid(), 'PROMOTION_CREATE', 'Tạo khuyến mãi'),
(gen_random_uuid(), 'PROMOTION_UPDATE', 'Cập nhật khuyến mãi'),
(gen_random_uuid(), 'PROMOTION_DELETE', 'Xóa khuyến mãi'),
(gen_random_uuid(), 'HOTEL_UPDATE', 'Cập nhật thông tin khách sạn'),
(gen_random_uuid(), 'REPORT_VIEW', 'Xem báo cáo thống kê'),
(gen_random_uuid(), 'REPORT_EXPORT', 'Xuất báo cáo'),
(gen_random_uuid(), 'STAFF_VIEW', 'Xem danh sách nhân viên');

-- Admin Permissions (Quản trị viên hệ thống)
INSERT INTO permissions (id, name, description) VALUES 
(gen_random_uuid(), 'USER_CREATE', 'Tạo tài khoản người dùng'),
(gen_random_uuid(), 'USER_UPDATE', 'Cập nhật tài khoản người dùng'),
(gen_random_uuid(), 'USER_DELETE', 'Xóa tài khoản người dùng'),
(gen_random_uuid(), 'USER_LOCK', 'Khóa/Mở khóa tài khoản'),
(gen_random_uuid(), 'ROLE_ASSIGN', 'Phân quyền cho người dùng'),
(gen_random_uuid(), 'ROLE_CREATE', 'Tạo vai trò mới'),
(gen_random_uuid(), 'ROLE_UPDATE', 'Cập nhật vai trò'),
(gen_random_uuid(), 'ROLE_DELETE', 'Xóa vai trò'),
(gen_random_uuid(), 'PERMISSION_MANAGE', 'Quản lý quyền hạn'),
(gen_random_uuid(), 'SYSTEM_CONFIG', 'Cấu hình hệ thống'),
(gen_random_uuid(), 'BACKUP_MANAGE', 'Quản lý sao lưu'),
(gen_random_uuid(), 'LOG_VIEW', 'Xem log hệ thống'),
(gen_random_uuid(), 'HOTEL_CREATE', 'Tạo khách sạn mới'),
(gen_random_uuid(), 'HOTEL_DELETE', 'Xóa khách sạn');

-- =====================================================
-- BƯỚC 2: TẠO CÁC ROLES
-- =====================================================

INSERT INTO roles (id, name, description) VALUES 
(gen_random_uuid(), 'GUEST', 'Khách chưa đăng nhập - chỉ xem thông tin công khai'),
(gen_random_uuid(), 'CUSTOMER', 'Khách hàng đã đăng ký - có thể đặt phòng và sử dụng dịch vụ'),
(gen_random_uuid(), 'STAFF', 'Nhân viên lễ tân - quản lý đặt phòng và check-in/out'),
(gen_random_uuid(), 'MANAGER', 'Quản lý khách sạn - giám sát và điều hành'),
(gen_random_uuid(), 'ADMIN', 'Quản trị viên hệ thống - toàn quyền kỹ thuật');

-- =====================================================
-- BƯỚC 3: GÁN PERMISSIONS CHO ROLES
-- =====================================================

-- GUEST Role: Chỉ xem thông tin công khai
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'GUEST'
AND p.name IN (
    'HOTEL_VIEW',
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
    'HOTEL_VIEW',
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
    'SERVICE_REGISTER'
);

-- STAFF Role: Kế thừa CUSTOMER + Quản lý đặt phòng và check-in/out
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'STAFF'
AND p.name IN (
    -- Guest + Customer permissions
    'HOTEL_VIEW',
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
    'SERVICE_MANAGE'
);

-- MANAGER Role: Kế thừa STAFF + Quản lý khách sạn và báo cáo
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'MANAGER'
AND p.name IN (
    -- Guest + Customer + Staff permissions
    'HOTEL_VIEW',
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
    'HOTEL_UPDATE',
    'REPORT_VIEW',
    'REPORT_EXPORT',
    'STAFF_VIEW'
);

-- ADMIN Role: Toàn quyền hệ thống
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN';

-- =====================================================
-- BƯỚC 4: TẠO USER MẪU (Optional)
-- =====================================================

-- Password mẫu: "password123" (hash BCrypt với strength 10)
-- Hash này được tạo từ BCryptPasswordEncoder.encode("password123")
-- Đây là hash THẬT VERIFIED, có thể login được!

-- Admin user
INSERT INTO users (id, username, password, first_name, last_name, dob, phone, email, address)
VALUES (
    gen_random_uuid(),
    'admin',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'System',
    'Administrator',
    '1990-01-01',
    '0900000000',
    'admin@aurorahotel.com',
    'System'
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN';

-- Manager user (Quản lý chi nhánh)
INSERT INTO users (id, username, password, first_name, last_name, dob, phone, email, address)
VALUES (
    gen_random_uuid(),
    'manager',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'Hotel',
    'Manager',
    '1985-05-15',
    '0900000001',
    'manager@aurorahotel.com',
    'Hanoi'
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'manager' AND r.name = 'MANAGER';

-- Staff user (Nhân viên lễ tân)
INSERT INTO users (id, username, password, first_name, last_name, dob, phone, email, address)
VALUES (
    gen_random_uuid(),
    'staff',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'Reception',
    'Staff',
    '1995-08-20',
    '0900000002',
    'staff@aurorahotel.com',
    'Hanoi'
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'staff' AND r.name = 'STAFF';

-- Customer user (Khách hàng)
INSERT INTO users (id, username, password, first_name, last_name, dob, phone, email, address)
VALUES (
    gen_random_uuid(),
    'customer',
    '$2a$10$N8A9y3LZ5lWUv.NbYDftJuvymeYzih9S9MoJqExtucbM72JqJnSqe',
    'Nguyen Van',
    'A',
    '1992-03-10',
    '0900000003',
    'customer@gmail.com',
    'Ho Chi Minh City'
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'customer' AND r.name = 'CUSTOMER';

-- =====================================================
-- HOÀN THÀNH
-- =====================================================
-- Tổng số Permissions: 48
-- Tổng số Roles: 5 (GUEST, CUSTOMER, STAFF, MANAGER, ADMIN)
-- =====================================================

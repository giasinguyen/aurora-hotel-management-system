-- ============================================================================
-- AURORA HOTEL MANAGEMENT SYSTEM - DATABASE SEED DATA
-- ============================================================================
-- File: init-db-pg-admin.sql
-- Description: SQL script để khởi tạo dữ liệu mẫu cho hệ thống Aurora Hotel
-- Author: Aurora Hotel System Team
-- Version: 1.1
-- 
-- HƯỚNG DẪN SỬ DỤNG:
-- 1. Chạy script này SAU KHI đã khởi tạo schema (JPA auto-create tables)
-- 2. init-roles-permissions.sql, fix-email-verified.sql và init-vector-store.sql đã tự chạy khi run dự án
-- 3. chạy init-db-pg-admin.sql để khởi tạo dữ liệu mẫu, Script này có thể chạy nhiều lần (idempotent với ON CONFLICT DO NOTHING)
--
-- LƯU Ý VỀ TÊN CỘT:
-- - Hibernate/JPA sử dụng naming strategy: camelCase -> snake_case
-- - Ví dụ: basePrice -> base_price, sizeM2 -> sizem2 (không phải size_m2)
-- - Các trường có số trong tên sẽ KHÔNG thêm underscore trước số
--
-- THỨ TỰ TABLES:
-- 1. branches (không phụ thuộc)
-- 2. amenities (không phụ thuộc)
-- 3. facilities (phụ thuộc branches)
-- 4. room_types (phụ thuộc branches)
-- 5. room_type_amenities (phụ thuộc room_types, amenities)
-- 6. rooms (phụ thuộc branches, room_types)
-- 7. services (phụ thuộc branches)
-- 8. promotions (phụ thuộc branches)
-- 9. bookings (phụ thuộc branches, users, promotions)
-- 10. booking_rooms (phụ thuộc bookings, rooms)
-- 11. service_bookings (phụ thuộc bookings, services, users)
-- 12. payments (phụ thuộc bookings)
-- ============================================================================

-- ============================================================================
-- 1. BRANCHES (Chi nhánh khách sạn)
-- Giữ nguyên 4 branches như DataSeeder
-- ============================================================================
INSERT INTO branches (
    id, name, code, address, ward, district, city,
    latitude, longitude, phone, email, website,
    description, total_rooms, status,
    check_in_time, check_out_time, operating_hours, images,
    created_at, updated_at, version, deleted
) VALUES 
-- Hanoi Branch
(
    'branch-hanoi-001',
    'Aurora Grand Hotel Hanoi',
    'AUR-HN',
    '1 Hoàn Kiếm',
    'Hàng Trống',
    'Quận Hoàn Kiếm',
    'Hanoi',
    21.0285,
    105.8542,
    '02432123456',
    'hanoi@aurorahotel.com',
    'https://aurorahotel.com/hanoi',
    'Khách sạn 5 sao sang trọng tại trung tâm Hà Nội, view Hồ Hoàn Kiếm',
    150,
    'ACTIVE',
    '14:00:00',
    '12:00:00',
    '24/7',
    '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Ho Chi Minh Branch
(
    'branch-hcm-001',
    'Aurora Grand Hotel Ho Chi Minh',
    'AUR-HCM',
    '123 Nguyễn Huệ',
    'Bến Nghé',
    'Quận 1',
    'Ho Chi Minh',
    10.7769,
    106.7009,
    '02838123456',
    'hcm@aurorahotel.com',
    'https://aurorahotel.com/hcm',
    'Khách sạn 5 sao hiện đại bên bờ sông Sài Gòn',
    200,
    'ACTIVE',
    '14:00:00',
    '12:00:00',
    '24/7',
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Da Nang Branch
(
    'branch-danang-001',
    'Aurora Beach Resort Da Nang',
    'AUR-DN',
    '999 Võ Nguyên Giáp',
    'Phước Mỹ',
    'Sơn Trà',
    'Da Nang',
    16.0544,
    108.2442,
    '02363123456',
    'danang@aurorahotel.com',
    'https://aurorahotel.com/danang',
    'Resort 5 sao view biển Mỹ Khê tuyệt đẹp',
    180,
    'ACTIVE',
    '14:00:00',
    '12:00:00',
    '24/7',
    '["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Nha Trang Branch (Under Maintenance)
(
    'branch-nhatrang-001',
    'Aurora Bay Resort Nha Trang',
    'AUR-NT',
    '50 Trần Phú',
    'Lộc Thọ',
    'Thành phố Nha Trang',
    'Nha Trang',
    12.2388,
    109.1967,
    '02583123456',
    'nhatrang@aurorahotel.com',
    'https://aurorahotel.com/nhatrang',
    'Resort sang trọng ngay bãi biển Nha Trang',
    120,
    'MAINTENANCE',
    '14:00:00',
    '12:00:00',
    '24/7',
    '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
)
ON CONFLICT (code) DO NOTHING;

-- Cập nhật manager cho Hanoi branch (sau khi có user manager từ init-roles-permissions.sql)
UPDATE branches 
SET manager_id = (SELECT id FROM users WHERE username = 'manager' LIMIT 1)
WHERE code = 'AUR-HN' AND manager_id IS NULL;

-- Cập nhật assigned_branch cho manager
UPDATE users 
SET assigned_branch_id = 'branch-hanoi-001'
WHERE username = 'manager' AND assigned_branch_id IS NULL;

-- ============================================================================
-- 2. AMENITIES (Tiện nghi phòng)
-- Chỉ tạo 2 amenities mỗi loại
-- ============================================================================
INSERT INTO amenities (
    id, name, type, description, icon, active, display_order,
    created_at, updated_at, version, deleted
) VALUES 
-- Technology
(
    'amenity-wifi-001',
    'High-Speed WiFi',
    'TECHNOLOGY',
    'Wifi tốc độ cao miễn phí',
    'wifi',
    true, 1,
    NOW(), NOW(), 0, false
),
(
    'amenity-tv-001',
    'Smart TV 55 inch',
    'TECHNOLOGY',
    'TV thông minh 55 inch với Netflix, YouTube',
    'tv',
    true, 2,
    NOW(), NOW(), 0, false
),
-- Bathroom
(
    'amenity-shower-001',
    'Rain Shower',
    'BATHROOM',
    'Vòi sen thác nước cao cấp',
    'shower',
    true, 3,
    NOW(), NOW(), 0, false
),
(
    'amenity-bathtub-001',
    'Bathtub',
    'BATHROOM',
    'Bồn tắm nằm sang trọng',
    'bathtub',
    true, 4,
    NOW(), NOW(), 0, false
),
-- Comfort
(
    'amenity-bed-001',
    'King Size Bed',
    'COMFORT',
    'Giường King size với nệm cao cấp',
    'bed',
    true, 5,
    NOW(), NOW(), 0, false
),
(
    'amenity-ac-001',
    'Air Conditioning',
    'COMFORT',
    'Điều hòa nhiệt độ Daikin inverter',
    'ac',
    true, 6,
    NOW(), NOW(), 0, false
),
-- Entertainment
(
    'amenity-minibar-001',
    'Mini Bar',
    'ENTERTAINMENT',
    'Tủ lạnh mini bar đầy đủ đồ uống',
    'minibar',
    true, 7,
    NOW(), NOW(), 0, false
),
(
    'amenity-coffee-001',
    'Coffee Machine',
    'ENTERTAINMENT',
    'Máy pha cà phê Nespresso',
    'coffee',
    true, 8,
    NOW(), NOW(), 0, false
),
-- Safety
(
    'amenity-safe-001',
    'Safe Box',
    'SAFETY',
    'Két sắt điện tử an toàn',
    'safe',
    true, 9,
    NOW(), NOW(), 0, false
)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. FACILITIES (Cơ sở vật chất)
-- Tạo 2 facilities cho mỗi branch
-- ============================================================================
INSERT INTO facilities (
    id, branch_id, name, type, description, location,
    opening_hours, capacity, requires_reservation, free_for_guests, active, images,
    created_at, updated_at, version, deleted
) VALUES 
-- Hanoi Facilities
(
    'facility-hn-pool-001',
    'branch-hanoi-001',
    'Rooftop Infinity Pool',
    'POOL',
    'Hồ bơi vô cực trên sân thượng tầng 30 với view toàn cảnh Hồ Hoàn Kiếm',
    'Floor 30 - Rooftop',
    '06:00 - 22:00',
    50,
    false,
    true,
    true,
    '["https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'facility-hn-spa-001',
    'branch-hanoi-001',
    'Aurora Spa & Wellness',
    'SPA',
    'Spa 5 sao với đầy đủ liệu trình massage, chăm sóc da',
    'Floor 2',
    '09:00 - 21:00',
    20,
    true,
    false,
    true,
    '["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- HCM Facilities
(
    'facility-hcm-pool-001',
    'branch-hcm-001',
    'Riverside Pool & Bar',
    'POOL',
    'Hồ bơi và bar bên bờ sông Sài Gòn',
    'Floor 1 - Riverside',
    '06:00 - 23:00',
    60,
    false,
    true,
    true,
    '["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'facility-hcm-gym-001',
    'branch-hcm-001',
    'Premium Gym & Yoga',
    'GYM',
    'Phòng gym và studio yoga với HLV cá nhân',
    'Floor 4',
    '05:00 - 23:00',
    40,
    false,
    true,
    true,
    '["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Da Nang Facilities
(
    'facility-dn-beach-001',
    'branch-danang-001',
    'Private Beach Access',
    'OTHER',
    'Bãi biển riêng với ghế nằm và ô dù miễn phí',
    'Beach Front',
    '06:00 - 19:00',
    200,
    false,
    true,
    true,
    '["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'facility-dn-spa-001',
    'branch-danang-001',
    'Ocean Spa Paradise',
    'SPA',
    'Spa view biển với liệu trình đá nóng, muối biển',
    'Beachfront Pavilion',
    '09:00 - 21:00',
    25,
    true,
    false,
    true,
    '["https://images.unsplash.com/photo-1600334585358-93470feb59ca?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. ROOM TYPES (Loại phòng)
-- Tạo 2 room types cho mỗi branch
-- LƯU Ý: sizeM2 -> sizem2 (không phải size_m2), numberOfBeds -> number_of_beds
-- ============================================================================
INSERT INTO room_types (
    id, branch_id, name, code, base_price, weekend_price,
    capacity_adults, capacity_children, max_occupancy,
    sizem2, bed_type, number_of_beds, refundable, smoking_allowed,
    description, images,
    created_at, updated_at, version, deleted
) VALUES 
-- Hanoi Room Types
(
    'roomtype-hn-dlx-001',
    'branch-hanoi-001',
    'Deluxe City View',
    'DLX',
    1500000.00,
    1800000.00,
    2, 1, 3,
    35.0,
    'King',
    1,
    true, false,
    'Phòng Deluxe view thành phố 35m2',
    '["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'roomtype-hn-exe-001',
    'branch-hanoi-001',
    'Executive Lake View',
    'EXE',
    2500000.00,
    3000000.00,
    2, 1, 3,
    45.0,
    'King',
    1,
    true, false,
    'Phòng Executive view Hồ Hoàn Kiếm 45m2',
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- HCM Room Types
(
    'roomtype-hcm-sup-001',
    'branch-hcm-001',
    'Superior Room',
    'SUP',
    1300000.00,
    1500000.00,
    2, 1, 3,
    30.0,
    'Queen',
    1,
    true, false,
    'Phòng Superior hiện đại 30m2',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'roomtype-hcm-drv-001',
    'branch-hcm-001',
    'Deluxe River View',
    'DRV',
    2200000.00,
    2600000.00,
    2, 1, 3,
    40.0,
    'King',
    1,
    true, false,
    'Phòng Deluxe view sông Sài Gòn 40m2',
    '["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1568605117037-4d9c780fac89?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Da Nang Room Types
(
    'roomtype-dn-bch-001',
    'branch-danang-001',
    'Beach View Room',
    'BCH',
    1800000.00,
    2200000.00,
    2, 1, 3,
    35.0,
    'King',
    1,
    true, false,
    'Phòng view biển trực diện 35m2',
    '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'roomtype-dn-ocn-001',
    'branch-danang-001',
    'Ocean Front Deluxe',
    'OCN',
    2800000.00,
    3200000.00,
    2, 1, 3,
    50.0,
    'King',
    1,
    true, false,
    'Phòng Deluxe view biển với ban công 50m2',
    '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. ROOM TYPE AMENITIES (Liên kết loại phòng - tiện nghi)
-- ============================================================================
INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id = 'roomtype-hn-dlx-001'
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-safe-001')
ON CONFLICT DO NOTHING;

INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id = 'roomtype-hn-exe-001'
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-safe-001', 
             'amenity-bathtub-001', 'amenity-minibar-001', 'amenity-coffee-001')
ON CONFLICT DO NOTHING;

INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id = 'roomtype-hcm-sup-001'
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-shower-001')
ON CONFLICT DO NOTHING;

INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id = 'roomtype-hcm-drv-001'
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-safe-001',
             'amenity-bathtub-001', 'amenity-minibar-001')
ON CONFLICT DO NOTHING;

INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id = 'roomtype-dn-bch-001'
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-shower-001')
ON CONFLICT DO NOTHING;

INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id = 'roomtype-dn-ocn-001'
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-safe-001',
             'amenity-bathtub-001', 'amenity-minibar-001', 'amenity-coffee-001')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. ROOMS (Phòng)
-- Tạo 2 rooms cho mỗi room type
-- ============================================================================
INSERT INTO rooms (
    id, branch_id, room_type_id, room_number, floor, status, view_type, images,
    created_at, updated_at, version, deleted
) VALUES 
-- Hanoi Rooms - Deluxe
(
    'room-hn-1001',
    'branch-hanoi-001',
    'roomtype-hn-dlx-001',
    '1001',
    10,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hn-1002',
    'branch-hanoi-001',
    'roomtype-hn-dlx-001',
    '1002',
    10,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Hanoi Rooms - Executive
(
    'room-hn-1501',
    'branch-hanoi-001',
    'roomtype-hn-exe-001',
    '1501',
    15,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hn-1502',
    'branch-hanoi-001',
    'roomtype-hn-exe-001',
    '1502',
    15,
    'OCCUPIED',
    'CITY',
    '["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- HCM Rooms - Superior
(
    'room-hcm-5001',
    'branch-hcm-001',
    'roomtype-hcm-sup-001',
    '5001',
    5,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hcm-5002',
    'branch-hcm-001',
    'roomtype-hcm-sup-001',
    '5002',
    5,
    'CLEANING',
    'CITY',
    '["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- HCM Rooms - Deluxe River
(
    'room-hcm-8001',
    'branch-hcm-001',
    'roomtype-hcm-drv-001',
    '8001',
    8,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1568605117037-4d9c780fac89?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hcm-8002',
    'branch-hcm-001',
    'roomtype-hcm-drv-001',
    '8002',
    8,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Da Nang Rooms - Beach View
(
    'room-dn-2001',
    'branch-danang-001',
    'roomtype-dn-bch-001',
    '2001',
    2,
    'AVAILABLE',
    'SEA',
    '["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-dn-2002',
    'branch-danang-001',
    'roomtype-dn-bch-001',
    '2002',
    2,
    'AVAILABLE',
    'SEA',
    '["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Da Nang Rooms - Ocean Front
(
    'room-dn-3001',
    'branch-danang-001',
    'roomtype-dn-ocn-001',
    '3001',
    3,
    'AVAILABLE',
    'SEA',
    '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-dn-3002',
    'branch-danang-001',
    'roomtype-dn-ocn-001',
    '3002',
    3,
    'RESERVED',
    'SEA',
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. SERVICES (Dịch vụ)
-- Tạo 2 services
-- ============================================================================
INSERT INTO services (
    id, branch_id, name, type, description, base_price, unit,
    duration_minutes, requires_booking, active, operating_hours, images,
    created_at, updated_at, version, deleted
) VALUES 
(
    'service-airport-001',
    'branch-hanoi-001',
    'Airport Transfer',
    'AIRPORT_TRANSFER',
    'Đưa đón sân bay Nội Bài - Khách sạn (1 chiều)',
    500000.00,
    'trip',
    60,
    true,
    true,
    '24/7',
    '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'service-spa-001',
    'branch-hanoi-001',
    'Spa & Massage',
    'SPA',
    'Liệu trình spa thư giãn 90 phút',
    800000.00,
    'session',
    90,
    true,
    true,
    '09:00 - 21:00',
    '["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1600334585358-93470feb59ca?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. PROMOTIONS (Khuyến mãi)
-- Tạo 2 promotions
-- ============================================================================
INSERT INTO promotions (
    id, branch_id, code, name, description,
    discount_type, percent_off, amount_off,
    min_booking_amount, max_discount_amount,
    start_at, end_at, active, usage_limit, used_count,
    stackable, exclusive_with_others, priority,
    created_at, updated_at, version, deleted
) VALUES 
(
    'promo-summer-001',
    'branch-hanoi-001',
    'SUMMER2024',
    'Summer Vacation 2024',
    'Giảm 20% cho booking từ 3 đêm trở lên',
    'PERCENTAGE',
    20.0,
    NULL,
    5000000.00,
    2000000.00,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '60 days',
    true,
    100,
    0,
    false, false, 1,
    NOW(), NOW(), 0, false
),
(
    'promo-welcome-001',
    'branch-hanoi-001',
    'WELCOME50',
    'Welcome New Customer',
    'Giảm 500k cho khách hàng mới',
    'FIXED_AMOUNT',
    NULL,
    500000.00,
    3000000.00,
    NULL,
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '90 days',
    true,
    500,
    0,
    false, false, 2,
    NOW(), NOW(), 0, false
)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 9. BOOKINGS (Đặt phòng)
-- Tạo 2 bookings
-- ============================================================================
INSERT INTO bookings (
    id, booking_code, branch_id, customer_id, applied_promotion_id,
    checkin, checkout, special_request,
    status, payment_status,
    subtotal_price, discount_amount, total_price, deposit_amount,
    email_sent, sms_sent,
    created_at, updated_at, version, deleted
) VALUES 
-- Booking 1: CONFIRMED với promotion
(
    'booking-001',
    'BK-HN-2024-001',
    'branch-hanoi-001',
    (SELECT id FROM users WHERE username = 'customer' LIMIT 1),
    'promo-summer-001',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '8 days',
    'Phòng tầng cao, view đẹp. Early check-in nếu có thể',
    'CONFIRMED',
    'DEPOSIT_PAID',
    9000000.00,
    1800000.00,
    7200000.00,
    3600000.00,
    true, false,
    NOW(), NOW(), 0, false
),
-- Booking 2: CHECKED_IN
(
    'booking-002',
    'BK-HN-2024-002',
    'branch-hanoi-001',
    (SELECT id FROM users WHERE username = 'customer' LIMIT 1),
    NULL,
    CURRENT_DATE - INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '3 days',
    NULL,
    'CHECKED_IN',
    'PAID',
    12500000.00,
    0.00,
    12500000.00,
    NULL,
    true, true,
    NOW(), NOW(), 0, false
)
ON CONFLICT (booking_code) DO NOTHING;

-- ============================================================================
-- 10. BOOKING ROOMS (Chi tiết phòng đặt)
-- Tạo 2 booking rooms
-- ============================================================================
INSERT INTO booking_rooms (
    id, booking_id, room_id,
    price_per_night, nights, actual_adults, actual_children,
    total_amount, guest_names,
    created_at, updated_at, version, deleted
) VALUES 
-- Booking 1: 1 phòng Deluxe
(
    'bookingroom-001',
    'booking-001',
    'room-hn-1001',
    1500000.00,
    3,
    2, 1,
    4500000.00,
    'Nguyen Van A, Nguyen Thi B',
    NOW(), NOW(), 0, false
),
-- Booking 2: 1 phòng Executive
(
    'bookingroom-002',
    'booking-002',
    'room-hn-1501',
    2500000.00,
    5,
    2, 0,
    12500000.00,
    'Tran Van C, Tran Thi D',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. SERVICE BOOKINGS (Đặt dịch vụ)
-- Tạo 2 service bookings
-- ============================================================================
INSERT INTO service_bookings (
    id, booking_id, service_id, customer_id,
    service_date_time, quantity, price_per_unit, total_price,
    status, special_instructions,
    created_at, updated_at, version, deleted
) VALUES 
-- Service booking 1: Airport transfer
(
    'servicebooking-001',
    'booking-001',
    'service-airport-001',
    (SELECT id FROM users WHERE username = 'customer' LIMIT 1),
    (CURRENT_DATE + INTERVAL '5 days')::timestamp + TIME '14:00:00',
    1,
    500000.00,
    500000.00,
    'CONFIRMED',
    'Pickup at airport terminal 1',
    NOW(), NOW(), 0, false
),
-- Service booking 2: Spa
(
    'servicebooking-002',
    'booking-001',
    'service-spa-001',
    (SELECT id FROM users WHERE username = 'customer' LIMIT 1),
    (CURRENT_DATE + INTERVAL '6 days')::timestamp + TIME '15:00:00',
    2,
    800000.00,
    1600000.00,
    'CONFIRMED',
    'Couple massage session',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. PAYMENTS (Thanh toán)
-- Tạo 2 payments
-- ============================================================================
INSERT INTO payments (
    id, booking_id, method, status,
    amount, currency,
    provider_txn_id, paid_at, notes, processed_by,
    created_at, updated_at, version, deleted
) VALUES 
-- Payment 1: Deposit cho Booking 1
(
    'payment-001',
    'booking-001',
    'BANK_TRANSFER',
    'SUCCESS',
    3600000.00,
    'VND',
    'TXN-AURORA-2024-001',
    NOW() - INTERVAL '3 days',
    'Deposit 50% for booking BK-HN-2024-001',
    'staff',
    NOW(), NOW(), 0, false
),
-- Payment 2: Full payment cho Booking 2
(
    'payment-002',
    'booking-002',
    'CARD',
    'SUCCESS',
    12500000.00,
    'VND',
    'TXN-AURORA-2024-002',
    NOW() - INTERVAL '2 days',
    'Full payment at check-in',
    'staff',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- Chạy các query sau để kiểm tra dữ liệu đã được insert thành công
-- ============================================================================

-- SELECT 'branches' as table_name, COUNT(*) as count FROM branches
-- UNION ALL SELECT 'amenities', COUNT(*) FROM amenities
-- UNION ALL SELECT 'facilities', COUNT(*) FROM facilities
-- UNION ALL SELECT 'room_types', COUNT(*) FROM room_types
-- UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
-- UNION ALL SELECT 'services', COUNT(*) FROM services
-- UNION ALL SELECT 'promotions', COUNT(*) FROM promotions
-- UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
-- UNION ALL SELECT 'booking_rooms', COUNT(*) FROM booking_rooms
-- UNION ALL SELECT 'service_bookings', COUNT(*) FROM service_bookings
-- UNION ALL SELECT 'payments', COUNT(*) FROM payments
-- ORDER BY table_name;

-- ============================================================================
-- END OF SEED DATA SCRIPT
-- ============================================================================


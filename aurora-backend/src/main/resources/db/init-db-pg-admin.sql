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
-- 4. room_categories (phụ thuộc branches) - MỚI: Hạng phòng
-- 5. room_types (phụ thuộc branches, room_categories)
-- 6. room_type_amenities (phụ thuộc room_types, amenities)
-- 7. rooms (phụ thuộc branches, room_types)
-- 8. services (phụ thuộc branches)
-- 9. promotions (phụ thuộc branches)
-- 10. bookings (phụ thuộc branches, users, promotions)
-- 11. booking_rooms (phụ thuộc bookings, rooms)
-- 12. service_bookings (phụ thuộc bookings, services, users)
-- 13. payments (phụ thuộc bookings)
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
-- 4. ROOM CATEGORIES (Hạng phòng)
-- Tạo 3 categories: Standard Room, Deluxe Room, Presidential Suite
-- CHỈ TẠO CHO HCM BRANCH
-- ============================================================================
INSERT INTO room_categories (
    id, branch_id, name, code, description, display_order, active, image_url,
    created_at, updated_at, version, deleted
) VALUES 
-- Standard Room Category
(
    'category-hcm-std-001',
    'branch-hcm-001',
    'Standard Room',
    'STD',
    'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, phù hợp cho khách du lịch và công tác',
    1,
    true,
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
    NOW(), NOW(), 0, false
),
-- Deluxe Room Category
(
    'category-hcm-dlx-001',
    'branch-hcm-001',
    'Deluxe Room',
    'DLX',
    'Phòng cao cấp với không gian rộng rãi và view đẹp, dịch vụ hoàn hảo',
    2,
    true,
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    NOW(), NOW(), 0, false
),
-- Presidential Suite Category
(
    'category-hcm-pre-001',
    'branch-hcm-001',
    'Presidential Suite',
    'PRE',
    'Phòng tổng thống sang trọng bậc nhất với đầy đủ tiện nghi 5 sao và dịch vụ butler riêng',
    3,
    true,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. ROOM TYPES (Loại phòng trong hạng)
-- Mỗi category có 2 loại: Single/Couple/Three Bedroom + View (City/Sea)
-- CHỈ TẠO CHO HCM BRANCH
-- LƯU Ý: sizeM2 -> sizem2 (không phải size_m2), numberOfBeds -> number_of_beds
-- ============================================================================
INSERT INTO room_types (
    id, branch_id, category_id, name, code, base_price, weekend_price,
    capacity_adults, capacity_children, max_occupancy,
    sizem2, bed_type, number_of_beds, refundable, smoking_allowed,
    description, short_description, images,
    created_at, updated_at, version, deleted
) VALUES 
-- ===== STANDARD ROOM CATEGORY =====
-- Standard Single Bedroom City View
(
    'roomtype-hcm-std-single-city-001',
    'branch-hcm-001',
    'category-hcm-std-001',
    'Single Bedroom City View',
    'SSCV',
    1200000.00,
    1400000.00,
    1, 0, 1,
    25.0,
    'SINGLE',
    1,
    true, false,
    'Phòng đơn tiêu chuẩn với view thành phố, phù hợp cho khách công tác. Trang bị đầy đủ tiện nghi cơ bản: TV, minibar, điều hòa, wifi miễn phí.',
    'Phòng đơn view thành phố 25m²',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Standard Couple Bedroom Sea View
(
    'roomtype-hcm-std-couple-sea-001',
    'branch-hcm-001',
    'category-hcm-std-001',
    'Couple Bedroom Sea View',
    'SCSV',
    1500000.00,
    1800000.00,
    2, 0, 2,
    30.0,
    'QUEEN',
    1,
    true, false,
    'Phòng đôi tiêu chuẩn với view sông Sài Gòn lãng mạn, giường Queen size thoải mái. Thích hợp cho cặp đôi, gia đình nhỏ.',
    'Phòng đôi view sông 30m²',
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),

-- ===== DELUXE ROOM CATEGORY =====
-- Deluxe Single Bedroom City View
(
    'roomtype-hcm-dlx-single-city-001',
    'branch-hcm-001',
    'category-hcm-dlx-001',
    'Deluxe Single Bedroom City View',
    'DSCV',
    1800000.00,
    2200000.00,
    1, 1, 2,
    35.0,
    'KING',
    1,
    true, false,
    'Phòng đơn cao cấp với giường King size, view toàn cảnh thành phố từ tầng cao. Nội thất sang trọng, phòng tắm đứng hiện đại.',
    'Phòng đơn cao cấp view thành phố 35m²',
    '["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Deluxe Couple Bedroom Sea View
(
    'roomtype-hcm-dlx-couple-sea-001',
    'branch-hcm-001',
    'category-hcm-dlx-001',
    'Deluxe Couple Bedroom Sea View',
    'DCSV',
    2200000.00,
    2600000.00,
    2, 1, 3,
    40.0,
    'KING',
    1,
    true, false,
    'Phòng đôi cao cấp view sông tuyệt đẹp, có ban công riêng. Bồn tắm nằm, minibar cao cấp, máy pha cà phê Nespresso.',
    'Phòng đôi cao cấp view sông 40m²',
    '["https://images.unsplash.com/photo-1568605117037-4d9c780fac89?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),

-- ===== PRESIDENTIAL SUITE CATEGORY =====
-- Presidential Two Bedroom City View
(
    'roomtype-hcm-pre-two-city-001',
    'branch-hcm-001',
    'category-hcm-pre-001',
    'Presidential Two Bedroom City View',
    'PTCV',
    4500000.00,
    5500000.00,
    4, 2, 6,
    80.0,
    'KING',
    2,
    true, false,
    'Suite 2 phòng ngủ siêu sang với view panorama thành phố. Phòng khách rộng, bếp nhỏ, 2 phòng tắm, dịch vụ butler 24/7.',
    'Suite 2 phòng ngủ view thành phố 80m²',
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Presidential Three Bedroom Sea View
(
    'roomtype-hcm-pre-three-sea-001',
    'branch-hcm-001',
    'category-hcm-pre-001',
    'Presidential Three Bedroom Sea View',
    'PTSV',
    6500000.00,
    8000000.00,
    6, 2, 8,
    120.0,
    'KING',
    3,
    true, false,
    'Suite tổng thống 3 phòng ngủ đẳng cấp nhất với view sông Sài Gòn 270°. Phòng khách 50m², phòng ăn riêng, bếp đầy đủ, 3 phòng tắm marble, spa mini, dịch vụ butler & limousine.',
    'Suite tổng thống 3 phòng ngủ view sông 120m²',
    '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. ROOM TYPE AMENITIES (Liên kết loại phòng - tiện nghi)
-- ============================================================================
-- Standard Room Types - Basic amenities
INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id IN ('roomtype-hcm-std-single-city-001', 'roomtype-hcm-std-couple-sea-001')
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-shower-001')
ON CONFLICT DO NOTHING;

-- Deluxe Room Types - Premium amenities
INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id IN ('roomtype-hcm-dlx-single-city-001', 'roomtype-hcm-dlx-couple-sea-001')
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-safe-001',
             'amenity-bathtub-001', 'amenity-minibar-001')
ON CONFLICT DO NOTHING;

-- Presidential Suite Types - All amenities
INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, a.id
FROM room_types rt, amenities a
WHERE rt.id IN ('roomtype-hcm-pre-two-city-001', 'roomtype-hcm-pre-three-sea-001')
AND a.id IN ('amenity-wifi-001', 'amenity-tv-001', 'amenity-ac-001', 'amenity-safe-001',
             'amenity-bathtub-001', 'amenity-minibar-001', 'amenity-coffee-001', 
             'amenity-bed-001', 'amenity-shower-001')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. ROOMS (Phòng cụ thể)
-- Tạo 10 phòng cho HCM - phân bố theo các loại
-- ============================================================================
INSERT INTO rooms (
    id, branch_id, room_type_id, room_number, floor, status, view_type, images,
    created_at, updated_at, version, deleted
) VALUES 
-- Standard Single Bedroom City View (2 phòng)
(
    'room-hcm-301',
    'branch-hcm-001',
    'roomtype-hcm-std-single-city-001',
    '301',
    3,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hcm-302',
    'branch-hcm-001',
    'roomtype-hcm-std-single-city-001',
    '302',
    3,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Standard Couple Bedroom Sea View (2 phòng)
(
    'room-hcm-501',
    'branch-hcm-001',
    'roomtype-hcm-std-couple-sea-001',
    '501',
    5,
    'AVAILABLE',
    'SEA',
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hcm-502',
    'branch-hcm-001',
    'roomtype-hcm-std-couple-sea-001',
    '502',
    5,
    'OCCUPIED',
    'SEA',
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Deluxe Single Bedroom City View (2 phòng)
(
    'room-hcm-801',
    'branch-hcm-001',
    'roomtype-hcm-dlx-single-city-001',
    '801',
    8,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hcm-802',
    'branch-hcm-001',
    'roomtype-hcm-dlx-single-city-001',
    '802',
    8,
    'CLEANING',
    'CITY',
    '["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Deluxe Couple Bedroom Sea View (2 phòng)
(
    'room-hcm-1001',
    'branch-hcm-001',
    'roomtype-hcm-dlx-couple-sea-001',
    '1001',
    10,
    'AVAILABLE',
    'SEA',
    '["https://images.unsplash.com/photo-1568605117037-4d9c780fac89?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
(
    'room-hcm-1002',
    'branch-hcm-001',
    'roomtype-hcm-dlx-couple-sea-001',
    '1002',
    10,
    'AVAILABLE',
    'SEA',
    '["https://images.unsplash.com/photo-1568605117037-4d9c780fac89?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Presidential Two Bedroom City View (1 phòng)
(
    'room-hcm-1501',
    'branch-hcm-001',
    'roomtype-hcm-pre-two-city-001',
    '1501',
    15,
    'AVAILABLE',
    'CITY',
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
),
-- Presidential Three Bedroom Sea View (1 phòng)
(
    'room-hcm-2001',
    'branch-hcm-001',
    'roomtype-hcm-pre-three-sea-001',
    '2001',
    20,
    'AVAILABLE',
    'SEA',
    '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop"]',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. SERVICES (Dịch vụ)
-- Tạo 2 services cho HCM
-- ============================================================================
INSERT INTO services (
    id, branch_id, name, type, description, base_price, unit,
    duration_minutes, requires_booking, active, operating_hours, images,
    created_at, updated_at, version, deleted
) VALUES 
(
    'service-hcm-airport-001',
    'branch-hcm-001',
    'Airport Transfer HCM',
    'AIRPORT_TRANSFER',
    'Đưa đón sân bay Tân Sơn Nhất - Khách sạn (1 chiều)',
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
    'service-hcm-spa-001',
    'branch-hcm-001',
    'Spa & Massage HCM',
    'SPA',
    'Liệu trình spa thư giãn 90 phút tại HCM',
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
-- 9. PROMOTIONS (Khuyến mãi)
-- Tạo 2 promotions cho HCM
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
    'promo-hcm-summer-001',
    'branch-hcm-001',
    'HCMSUMMER2024',
    'Summer Vacation HCM 2024',
    'Giảm 20% cho booking từ 3 đêm trở lên tại HCM',
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
    'promo-hcm-welcome-001',
    'branch-hcm-001',
    'HCMWELCOME50',
    'Welcome New Customer HCM',
    'Giảm 500k cho khách hàng mới tại HCM',
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
-- 10. BOOKINGS (Đặt phòng)
-- Tạo 2 bookings cho HCM
-- ============================================================================
INSERT INTO bookings (
    id, booking_code, branch_id, customer_id, applied_promotion_id,
    checkin, checkout, special_request,
    status, payment_status,
    subtotal_price, discount_amount, total_price, deposit_amount,
    email_sent, sms_sent,
    created_at, updated_at, version, deleted
) VALUES 
-- Booking 1: CONFIRMED - Standard Couple Sea View
(
    'booking-hcm-001',
    'BK-HCM-2024-001',
    'branch-hcm-001',
    (SELECT id FROM users WHERE username = 'customer' LIMIT 1),
    NULL,
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '8 days',
    'Phòng tầng cao, view đẹp. Early check-in nếu có thể',
    'CONFIRMED',
    'DEPOSIT_PAID',
    4500000.00,
    0.00,
    4500000.00,
    2250000.00,
    true, false,
    NOW(), NOW(), 0, false
),
-- Booking 2: CHECKED_IN - Deluxe Couple Sea View
(
    'booking-hcm-002',
    'BK-HCM-2024-002',
    'branch-hcm-001',
    (SELECT id FROM users WHERE username = 'customer' LIMIT 1),
    NULL,
    CURRENT_DATE - INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '3 days',
    NULL,
    'CHECKED_IN',
    'PAID',
    11000000.00,
    0.00,
    11000000.00,
    NULL,
    true, true,
    NOW(), NOW(), 0, false
)
ON CONFLICT (booking_code) DO NOTHING;

-- ============================================================================
-- 11. BOOKING ROOMS (Chi tiết phòng đặt)
-- Tạo 2 booking rooms cho HCM
-- ============================================================================
INSERT INTO booking_rooms (
    id, booking_id, room_id,
    price_per_night, nights, actual_adults, actual_children,
    total_amount, guest_names,
    created_at, updated_at, version, deleted
) VALUES 
-- Booking 1: Standard Couple Sea View (room 502 - đang OCCUPIED)
(
    'bookingroom-hcm-001',
    'booking-hcm-001',
    'room-hcm-502',
    1500000.00,
    3,
    2, 0,
    4500000.00,
    'Nguyen Van A, Nguyen Thi B',
    NOW(), NOW(), 0, false
),
-- Booking 2: Deluxe Couple Sea View (room 1001)
(
    'bookingroom-hcm-002',
    'booking-hcm-002',
    'room-hcm-1001',
    2200000.00,
    5,
    2, 0,
    11000000.00,
    'Tran Van C, Tran Thi D',
    NOW(), NOW(), 0, false
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. SERVICE BOOKINGS (Đặt dịch vụ)
-- Tạo 2 service bookings cho HCM
-- ============================================================================
INSERT INTO service_bookings (
    id, booking_id, service_id, customer_id,
    service_date_time, quantity, price_per_unit, total_price,
    status, special_instructions,
    created_at, updated_at, version, deleted
) VALUES 
-- Service booking 1: Airport transfer cho booking HCM 1
(
    'servicebooking-hcm-001',
    'booking-hcm-001',
    'service-hcm-airport-001',
    (SELECT id FROM users WHERE username = 'customer' LIMIT 1),
    (CURRENT_DATE + INTERVAL '5 days')::timestamp + TIME '14:00:00',
    1,
    500000.00,
    500000.00,
    'CONFIRMED',
    'Pickup at Tan Son Nhat airport',
    NOW(), NOW(), 0, false
),
-- Service booking 2: Spa cho booking HCM 1
(
    'servicebooking-hcm-002',
    'booking-hcm-001',
    'service-hcm-spa-001',
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
-- 13. PAYMENTS (Thanh toán)
-- Tạo 2 payments cho HCM
-- ============================================================================
INSERT INTO payments (
    id, booking_id, method, status,
    amount, currency,
    provider_txn_id, paid_at, notes, processed_by,
    created_at, updated_at, version, deleted
) VALUES 
-- Payment 1: Deposit cho Booking HCM 1
(
    'payment-hcm-001',
    'booking-hcm-001',
    'BANK_TRANSFER',
    'SUCCESS',
    2250000.00,
    'VND',
    'TXN-AURORA-HCM-2024-001',
    NOW() - INTERVAL '3 days',
    'Deposit 50% for booking BK-HCM-2024-001',
    'staff',
    NOW(), NOW(), 0, false
),
-- Payment 2: Full payment cho Booking HCM 2
(
    'payment-hcm-002',
    'booking-hcm-002',
    'CARD',
    'SUCCESS',
    11000000.00,
    'VND',
    'TXN-AURORA-HCM-2024-002',
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


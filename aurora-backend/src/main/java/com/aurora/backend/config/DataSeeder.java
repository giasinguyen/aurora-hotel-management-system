package com.aurora.backend.config;

import com.aurora.backend.entity.*;
import com.aurora.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

/**
 * DataSeeder - Tự động insert dữ liệu test vào database
 * 
 * Chỉ chạy khi profile = "dev" hoặc "local"
 * Sử dụng Spring Data JPA để đảm bảo type-safe và tự động map đúng tên cột
 * 
 * @author Aurora Hotel System
 * @version 2.0
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
@Profile({"dev", "local"}) // Chỉ chạy ở môi trường dev/local
public class DataSeeder {

    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final AmenityRepository amenityRepository;
    private final FacilityRepository facilityRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;
    private final PromotionRepository promotionRepository;
    private final BookingRepository bookingRepository;
    private final BookingRoomRepository bookingRoomRepository;
    private final ServiceBookingRepository serviceBookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;
    private final DataSeederHelper helper;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            log.info("🌱 Starting database seeding process...");
            
            try {
                long startTime = System.currentTimeMillis();
                
                // 1. Seed Branches
                log.info("📍 [1/12] Seeding branches...");
                Map<String, Branch> branches = seedBranches();
                
                // 2. Seed Amenities
                log.info("🛋️  [2/12] Seeding amenities...");
                Map<String, Amenity> amenities = seedAmenities();
                
                // 3. Seed Facilities
                log.info("🏊 [3/12] Seeding facilities...");
                helper.seedFacilities(branches);
                
                // 4. Seed Room Types
                log.info("🛏️  [4/12] Seeding room types...");
                Map<String, RoomType> roomTypes = helper.seedRoomTypes(branches, amenities);
                
                // 5. Seed Rooms
                log.info("🚪 [5/12] Seeding rooms...");
                Map<String, Room> rooms = helper.seedRooms(branches, roomTypes);
                
                // 6. Seed Services
                log.info("💆 [6/12] Seeding services...");
                Map<String, Service> services = helper.seedServices(branches);
                
                // 7. Seed Promotions
                log.info("🎁 [7/12] Seeding promotions...");
                Map<String, Promotion> promotions = helper.seedPromotions(branches);
                
                // 8. Get sample customer (from init-roles-permissions.sql)
                log.info("👤 [8/12] Loading sample customer...");
                User customer = userRepository.findByUsername("customer")
                        .orElseThrow(() -> new RuntimeException("❌ Customer user not found! Please run init-roles-permissions.sql first"));
                log.info("   ✅ Found customer: {}", customer.getUsername());
                
                // 9. Seed Bookings
                log.info("📅 [9/12] Seeding bookings...");
                Map<String, Booking> bookings = helper.seedBookings(branches, customer, promotions);
                
                // 10. Seed Booking Rooms
                log.info("🛏️  [10/12] Seeding booking rooms...");
                helper.seedBookingRooms(bookings, rooms);
                
                // 11. Seed Service Bookings
                log.info("💆 [11/12] Seeding service bookings...");
                helper.seedServiceBookings(bookings, services, customer);
                
                // 12. Seed Payments
                log.info("💳 [12/13] Seeding payments...");
                helper.seedPayments(bookings);
                
                // 13. Seed Reviews
                log.info("⭐ [13/13] Seeding reviews...");
                helper.seedReviews(bookings, customer);
                
                long endTime = System.currentTimeMillis();
                long duration = (endTime - startTime) / 1000;
                
                log.info("╔════════════════════════════════════════════════════════════╗");
                log.info("║          ✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!        ║");
                log.info("╠════════════════════════════════════════════════════════════╣");
                log.info("║  📊 SUMMARY:                                               ║");
                log.info("║  ├─ Branches:         {:>4}                                 ║", branchRepository.count());
                log.info("║  ├─ Amenities:        {:>4}                                 ║", amenityRepository.count());
                log.info("║  ├─ Facilities:       {:>4}                                 ║", facilityRepository.count());
                log.info("║  ├─ Room Types:       {:>4}                                 ║", roomTypeRepository.count());
                log.info("║  ├─ Rooms:            {:>4}                                 ║", roomRepository.count());
                log.info("║  ├─ Services:         {:>4}                                 ║", serviceRepository.count());
                log.info("║  ├─ Promotions:       {:>4}                                 ║", promotionRepository.count());
                log.info("║  ├─ Bookings:         {:>4}                                 ║", bookingRepository.count());
                log.info("║  ├─ Booking Rooms:    {:>4}                                 ║", bookingRoomRepository.count());
                log.info("║  ├─ Service Bookings: {:>4}                                 ║", serviceBookingRepository.count());
                log.info("║  ├─ Payments:         {:>4}                                 ║", paymentRepository.count());
                log.info("║  └─ Reviews:          {:>4}                                 ║", reviewRepository.count());
                log.info("║                                                            ║");
                log.info("║  ⏱️  Completed in {} seconds                                ║", duration);
                log.info("╚════════════════════════════════════════════════════════════╝");
                
            } catch (Exception e) {
                log.error("╔════════════════════════════════════════════════════════════╗");
                log.error("║              ❌ DATABASE SEEDING FAILED!                    ║");
                log.error("╚════════════════════════════════════════════════════════════╝");
                log.error("Error details: {}", e.getMessage(), e);
                throw new RuntimeException("Database seeding failed", e);
            }
        };
    }

    // =========================================================================
    // SEED METHODS
    // =========================================================================

    private Map<String, Branch> seedBranches() {
        Map<String, Branch> branches = new HashMap<>();
        
        // Idempotency check
        if (branchRepository.count() > 0) {
            log.info("⏭️  Branches already exist, skipping seed");
            branchRepository.findAll().forEach(b -> branches.put(b.getCode().toLowerCase().replace("aur-", ""), b));
            return branches;
        }
        
        // Branch 1: Hanoi
        Branch hanoi = Branch.builder()
                .name("Aurora Grand Hotel Hanoi")
                .code("AUR-HN")
                .address("1 Hoàn Kiếm")
                .ward("Hàng Trống")
                .district("Quận Hoàn Kiếm")
                .city("Hanoi")
                .latitude(21.0285)
                .longitude(105.8542)
                .phone("02432123456")
                .email("hanoi@aurorahotel.com")
                .website("https://aurorahotel.com/hanoi")
                .description("Khách sạn 5 sao sang trọng tại trung tâm Hà Nội, view Hồ Hoàn Kiếm")
                .rating(5.0)
                .totalRooms(150)
                .status(Branch.BranchStatus.ACTIVE)
                .checkInTime(LocalTime.of(14, 0))
                .checkOutTime(LocalTime.of(12, 0))
                .build();
        branches.put("hanoi", branchRepository.save(hanoi));
        
        // Branch 2: Ho Chi Minh
        Branch hcm = Branch.builder()
                .name("Aurora Grand Hotel Ho Chi Minh")
                .code("AUR-HCM")
                .address("123 Nguyễn Huệ")
                .ward("Bến Nghé")
                .district("Quận 1")
                .city("Ho Chi Minh")
                .latitude(10.7769)
                .longitude(106.7009)
                .phone("02838123456")
                .email("hcm@aurorahotel.com")
                .website("https://aurorahotel.com/hcm")
                .description("Khách sạn 5 sao hiện đại bên bờ sông Sài Gòn")
                .rating(5.0)
                .totalRooms(200)
                .status(Branch.BranchStatus.ACTIVE)
                .checkInTime(LocalTime.of(14, 0))
                .checkOutTime(LocalTime.of(12, 0))
                .build();
        branches.put("hcm", branchRepository.save(hcm));
        
        // Branch 3: Da Nang
        Branch danang = Branch.builder()
                .name("Aurora Beach Resort Da Nang")
                .code("AUR-DN")
                .address("999 Võ Nguyên Giáp")
                .ward("Phước Mỹ")
                .district("Sơn Trà")
                .city("Da Nang")
                .latitude(16.0544)
                .longitude(108.2442)
                .phone("02363123456")
                .email("danang@aurorahotel.com")
                .website("https://aurorahotel.com/danang")
                .description("Resort 5 sao view biển Mỹ Khê tuyệt đẹp")
                .rating(5.0)
                .totalRooms(180)
                .status(Branch.BranchStatus.ACTIVE)
                .checkInTime(LocalTime.of(14, 0))
                .checkOutTime(LocalTime.of(12, 0))
                .build();
        branches.put("danang", branchRepository.save(danang));
        
        // Branch 4: Nha Trang (Under Maintenance)
        Branch nhatrang = Branch.builder()
                .name("Aurora Bay Resort Nha Trang")
                .code("AUR-NT")
                .address("50 Trần Phú")
                .ward("Lộc Thọ")
                .district("Thành phố Nha Trang")
                .city("Nha Trang")
                .latitude(12.2388)
                .longitude(109.1967)
                .phone("02583123456")
                .email("nhatrang@aurorahotel.com")
                .website("https://aurorahotel.com/nhatrang")
                .description("Resort sang trọng ngay bãi biển Nha Trang")
                .rating(4.0)
                .totalRooms(120)
                .status(Branch.BranchStatus.MAINTENANCE)
                .checkInTime(LocalTime.of(14, 0))
                .checkOutTime(LocalTime.of(12, 0))
                .build();
        branches.put("nhatrang", branchRepository.save(nhatrang));
        
        // Assign manager to Hanoi branch
        User manager = userRepository.findByUsername("manager").orElse(null);
        if (manager != null) {
            hanoi.setManager(manager);
            branchRepository.save(hanoi);
            manager.setAssignedBranch(hanoi);
            userRepository.save(manager);
        }
        
        log.info("   ✅ Seeded {} branches", branches.size());
        return branches;
    }

    private Map<String, Amenity> seedAmenities() {
        // Idempotency check
        if (amenityRepository.count() > 0) {
            log.info("   ⏭️  Amenities already exist (count: {}), skipping...", amenityRepository.count());
            Map<String, Amenity> amenities = new HashMap<>();
            amenityRepository.findAll().forEach(a -> 
                amenities.put(a.getName().toLowerCase().replace(" ", "_").replace("-", "_"), a)
            );
            return amenities;
        }
        
        Map<String, Amenity> amenities = new HashMap<>();
        List<Amenity> amenityList = new ArrayList<>();
        
        // Technology Amenities
        amenityList.add(Amenity.builder()
                .name("High-Speed WiFi")
                .type(Amenity.AmenityType.TECHNOLOGY)
                .description("Wifi tốc độ cao miễn phí")
                .icon("wifi")
                .active(true)
                .displayOrder(1)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Smart TV 55 inch")
                .type(Amenity.AmenityType.TECHNOLOGY)
                .description("TV thông minh 55 inch với Netflix, YouTube")
                .icon("tv")
                .active(true)
                .displayOrder(2)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Bluetooth Speaker")
                .type(Amenity.AmenityType.TECHNOLOGY)
                .description("Loa Bluetooth JBL cao cấp")
                .icon("speaker")
                .active(true)
                .displayOrder(3)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Work Desk & Chair")
                .type(Amenity.AmenityType.TECHNOLOGY)
                .description("Bàn làm việc ergonomic với ghế văn phòng")
                .icon("desk")
                .active(true)
                .displayOrder(4)
                .build());
        
        // Bathroom Amenities
        amenityList.add(Amenity.builder()
                .name("Rain Shower")
                .type(Amenity.AmenityType.BATHROOM)
                .description("Vòi sen thác nước cao cấp")
                .icon("shower")
                .active(true)
                .displayOrder(5)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Bathtub")
                .type(Amenity.AmenityType.BATHROOM)
                .description("Bồn tắm nằm sang trọng")
                .icon("bathtub")
                .active(true)
                .displayOrder(6)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Premium Toiletries")
                .type(Amenity.AmenityType.BATHROOM)
                .description("Bộ đồ dùng vệ sinh cao cấp Hermes")
                .icon("soap")
                .active(true)
                .displayOrder(7)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Hair Dryer")
                .type(Amenity.AmenityType.BATHROOM)
                .description("Máy sấy tóc Dyson")
                .icon("hairdryer")
                .active(true)
                .displayOrder(8)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Towel Warmer")
                .type(Amenity.AmenityType.BATHROOM)
                .description("Máy sấy khăn ấm")
                .icon("towel")
                .active(true)
                .displayOrder(9)
                .build());
        
        // Bedroom Amenities
        amenityList.add(Amenity.builder()
                .name("King Size Bed")
                .type(Amenity.AmenityType.COMFORT)
                .description("Giường King size với nệm cao cấp")
                .icon("bed")
                .active(true)
                .displayOrder(10)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Premium Bedding")
                .type(Amenity.AmenityType.COMFORT)
                .description("Bộ chăn ga gối cao cấp 100% cotton")
                .icon("bedding")
                .active(true)
                .displayOrder(11)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Blackout Curtains")
                .type(Amenity.AmenityType.COMFORT)
                .description("Rèm cửa chống ánh sáng hoàn toàn")
                .icon("curtains")
                .active(true)
                .displayOrder(12)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Air Conditioning")
                .type(Amenity.AmenityType.COMFORT)
                .description("Điều hòa nhiệt độ Daikin inverter")
                .icon("ac")
                .active(true)
                .displayOrder(13)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Safe Box")
                .type(Amenity.AmenityType.SAFETY)
                .description("Két sắt điện tử an toàn")
                .icon("safe")
                .active(true)
                .displayOrder(14)
                .build());
        
        // Entertainment Amenities
        amenityList.add(Amenity.builder()
                .name("Mini Bar")
                .type(Amenity.AmenityType.ENTERTAINMENT)
                .description("Tủ lạnh mini bar đầy đủ đồ uống")
                .icon("minibar")
                .active(true)
                .displayOrder(15)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Coffee Machine")
                .type(Amenity.AmenityType.ENTERTAINMENT)
                .description("Máy pha cà phê Nespresso")
                .icon("coffee")
                .active(true)
                .displayOrder(16)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Tea Set")
                .type(Amenity.AmenityType.ENTERTAINMENT)
                .description("Bộ ấm trà và trà cao cấp")
                .icon("tea")
                .active(true)
                .displayOrder(17)
                .build());
        
        amenityList.add(Amenity.builder()
                .name("Balcony")
                .type(Amenity.AmenityType.COMFORT)
                .description("Ban công riêng với view đẹp")
                .icon("balcony")
                .active(true)
                .displayOrder(18)
                .build());
        
        // Save all
        List<Amenity> savedAmenities = amenityRepository.saveAll(amenityList);
        for (int i = 0; i < savedAmenities.size(); i++) {
            amenities.put("amenity_" + (i + 1), savedAmenities.get(i));
        }
        
        log.info("   ✅ Seeded {} amenities", amenities.size());
        return amenities;
    }

    // Tiếp tục trong file khác do giới hạn độ dài...
}

package com.aurora.backend.config;

import com.aurora.backend.entity.*;
import com.aurora.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * DataSeederHelper - Helper methods for DataSeeder
 * Contains seed methods for Facilities, RoomTypes, Rooms, Services, etc.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeederHelper {

    private final BranchRepository branchRepository;
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
    private final UserRepository userRepository;

    // =========================================================================
    // FACILITIES
    // =========================================================================
    
    public void seedFacilities(Map<String, Branch> branches) {
        // Idempotency check
        if (facilityRepository.count() > 0) {
            log.info("   ⏭️  Facilities already exist (count: {}), skipping...", facilityRepository.count());
            return;
        }
        
        List<Facility> facilities = new ArrayList<>();
        
        // Load branches directly from DB to ensure they are managed entities
        Branch hanoi = branchRepository.findByCode("AUR-HN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HN not found"));
        Branch hcm = branchRepository.findByCode("AUR-HCM")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HCM not found"));
        Branch danang = branchRepository.findByCode("AUR-DN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-DN not found"));
        
        // Hanoi Facilities
        facilities.add(Facility.builder()
                .branch(hanoi)
                .name("Rooftop Infinity Pool")
                .type(Facility.FacilityType.POOL)
                .description("Hồ bơi vô cực trên sân thượng tầng 30 với view toàn cảnh Hồ Hoàn Kiếm")
                .location("Floor 30 - Rooftop")
                .openingHours("06:00 - 22:00")
                .capacity(50)
                .requiresReservation(false)
                .freeForGuests(true)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hanoi)
                .name("Aurora Spa & Wellness")
                .type(Facility.FacilityType.SPA)
                .description("Spa 5 sao với đầy đủ liệu trình massage, chăm sóc da")
                .location("Floor 2")
                .openingHours("09:00 - 21:00")
                .capacity(20)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hanoi)
                .name("Fitness Center Premium")
                .type(Facility.FacilityType.GYM)
                .description("Phòng gym hiện đại với thiết bị Technogym")
                .location("Floor 3")
                .openingHours("05:00 - 23:00")
                .capacity(30)
                .requiresReservation(false)
                .freeForGuests(true)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hanoi)
                .name("Sky Lounge Restaurant")
                .type(Facility.FacilityType.RESTAURANT)
                .description("Nhà hàng cao cấp phục vụ ẩm thực Á - Âu")
                .location("Floor 29")
                .openingHours("06:00 - 23:00")
                .capacity(80)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hanoi)
                .name("Business Center")
                .type(Facility.FacilityType.BUSINESS_CENTER)
                .description("Trung tâm hội nghị với 5 phòng meeting hiện đại")
                .location("Floor 5")
                .openingHours("07:00 - 22:00")
                .capacity(100)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        // HCM Facilities
        facilities.add(Facility.builder()
                .branch(hcm)
                .name("Riverside Pool & Bar")
                .type(Facility.FacilityType.POOL)
                .description("Hồ bơi và bar bên bờ sông Sài Gòn")
                .location("Floor 1 - Riverside")
                .openingHours("06:00 - 23:00")
                .capacity(60)
                .requiresReservation(false)
                .freeForGuests(true)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hcm)
                .name("Luxury Spa Suite")
                .type(Facility.FacilityType.SPA)
                .description("Spa cao cấp với 10 phòng trị liệu riêng biệt")
                .location("Floor 3")
                .openingHours("08:00 - 22:00")
                .capacity(30)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hcm)
                .name("Premium Gym & Yoga")
                .type(Facility.FacilityType.GYM)
                .description("Phòng gym và studio yoga với HLV cá nhân")
                .location("Floor 4")
                .openingHours("05:00 - 23:00")
                .capacity(40)
                .requiresReservation(false)
                .freeForGuests(true)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hcm)
                .name("The Pearl Restaurant")
                .type(Facility.FacilityType.RESTAURANT)
                .description("Nhà hàng hải sản cao cấp view sông Sài Gòn")
                .location("Floor 1 - Riverside")
                .openingHours("11:00 - 23:00")
                .capacity(100)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(hcm)
                .name("Kids Club")
                .type(Facility.FacilityType.KIDS_CLUB)
                .description("Khu vui chơi trẻ em với giám sát viên chuyên nghiệp")
                .location("Floor 2")
                .openingHours("08:00 - 20:00")
                .capacity(25)
                .requiresReservation(false)
                .freeForGuests(true)
                .active(true)
                .build());
        
        // Da Nang Facilities
        facilities.add(Facility.builder()
                .branch(danang)
                .name("Private Beach Access")
                .type(Facility.FacilityType.OTHER)
                .description("Bãi biển riêng với ghế nằm và ô dù miễn phí")
                .location("Beach Front")
                .openingHours("06:00 - 19:00")
                .capacity(200)
                .requiresReservation(false)
                .freeForGuests(true)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(danang)
                .name("Ocean Spa Paradise")
                .type(Facility.FacilityType.SPA)
                .description("Spa view biển với liệu trình đá nóng, muối biển")
                .location("Beachfront Pavilion")
                .openingHours("09:00 - 21:00")
                .capacity(25)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(danang)
                .name("Beachfront Infinity Pool")
                .type(Facility.FacilityType.POOL)
                .description("Hồ bơi vô cực hướng biển")
                .location("Beach Level")
                .openingHours("06:00 - 22:00")
                .capacity(70)
                .requiresReservation(false)
                .freeForGuests(true)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(danang)
                .name("Water Sports Center")
                .type(Facility.FacilityType.OTHER)
                .description("Trung tâm thể thao dưới nước: lướt ván, lặn biển")
                .location("Beach")
                .openingHours("07:00 - 18:00")
                .capacity(40)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        facilities.add(Facility.builder()
                .branch(danang)
                .name("Seafood BBQ Restaurant")
                .type(Facility.FacilityType.RESTAURANT)
                .description("Nhà hàng BBQ hải sản tươi sống bên bờ biển")
                .location("Beachfront")
                .openingHours("17:00 - 23:00")
                .capacity(120)
                .requiresReservation(true)
                .freeForGuests(false)
                .active(true)
                .build());
        
        facilityRepository.saveAll(facilities);
        log.info("   ✅ Seeded {} facilities", facilities.size());
    }

    // =========================================================================
    // ROOM TYPES
    // =========================================================================
    
    public Map<String, RoomType> seedRoomTypes(Map<String, Branch> branches, Map<String, Amenity> amenities) {
        // Idempotency check
        if (roomTypeRepository.count() > 0) {
            log.info("   ⏭️  Room types already exist (count: {}), skipping...", roomTypeRepository.count());
            return new HashMap<>(); // Return empty map since we load entities directly now
        }
        
        // Load branches directly from DB to ensure they are managed entities
        Branch hanoi = branchRepository.findByCode("AUR-HN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HN not found"));
        Branch hcm = branchRepository.findByCode("AUR-HCM")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HCM not found"));
        Branch danang = branchRepository.findByCode("AUR-DN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-DN not found"));
        
        Map<String, RoomType> roomTypes = new HashMap<>();
        List<RoomType> roomTypeList = new ArrayList<>();
        
        // Get some amenities for room types
        List<Amenity> basicAmenities = amenityRepository.findAll().subList(0, 8);
        List<Amenity> premiumAmenities = amenityRepository.findAll().subList(0, 12);
        List<Amenity> allAmenities = amenityRepository.findAll();
        
        // Hanoi Room Types
        RoomType hanoiDeluxe = RoomType.builder()
                .branch(hanoi)
                .name("Deluxe City View")
                .code("DLX")
                .basePrice(new BigDecimal("1500000"))
                .capacityAdults(2)
                .capacityChildren(1)
                .maxOccupancy(3)
                .sizeM2(35.0)
                .bedType("King")
                .numberOfBeds(1)
                .description("Phòng Deluxe view thành phố 35m2")
                .build();
        hanoiDeluxe.setAmenities(new HashSet<>(basicAmenities));
        roomTypeList.add(hanoiDeluxe);
        roomTypes.put("hanoi_deluxe", hanoiDeluxe);
        
        RoomType hanoiExecutive = RoomType.builder()
                .branch(hanoi)
                .name("Executive Lake View")
                .code("EXE")
                .basePrice(new BigDecimal("2500000"))
                .capacityAdults(2)
                .capacityChildren(1)
                .maxOccupancy(3)
                .sizeM2(45.0)
                .bedType("King")
                .numberOfBeds(1)
                .description("Phòng Executive view Hồ Hoàn Kiếm 45m2")
                .build();
        hanoiExecutive.setAmenities(new HashSet<>(premiumAmenities));
        roomTypeList.add(hanoiExecutive);
        roomTypes.put("hanoi_executive", hanoiExecutive);
        
        RoomType hanoiSuite = RoomType.builder()
                .branch(hanoi)
                .name("Junior Suite")
                .code("JST")
                .basePrice(new BigDecimal("3500000"))
                .capacityAdults(2)
                .capacityChildren(2)
                .maxOccupancy(4)
                .sizeM2(60.0)
                .bedType("King + Sofa Bed")
                .numberOfBeds(2)
                .description("Suite Junior với phòng khách riêng 60m2")
                .build();
        hanoiSuite.setAmenities(new HashSet<>(allAmenities));
        roomTypeList.add(hanoiSuite);
        roomTypes.put("hanoi_suite", hanoiSuite);
        
        RoomType hanoiPresidential = RoomType.builder()
                .branch(hanoi)
                .name("Presidential Suite")
                .code("PRE")
                .basePrice(new BigDecimal("8000000"))
                .capacityAdults(4)
                .capacityChildren(2)
                .maxOccupancy(6)
                .sizeM2(120.0)
                .bedType("King + Queen")
                .numberOfBeds(2)
                .description("Suite Tổng Thống sang trọng 120m2")
                .build();
        hanoiPresidential.setAmenities(new HashSet<>(allAmenities));
        roomTypeList.add(hanoiPresidential);
        roomTypes.put("hanoi_presidential", hanoiPresidential);
        
        // HCM Room Types
        RoomType hcmSuperior = RoomType.builder()
                .branch(hcm)
                .name("Superior Room")
                .code("SUP")
                .basePrice(new BigDecimal("1300000"))
                .capacityAdults(2)
                .capacityChildren(1)
                .maxOccupancy(3)
                .sizeM2(30.0)
                .bedType("Queen")
                .numberOfBeds(1)
                .description("Phòng Superior hiện đại 30m2")
                .build();
        hcmSuperior.setAmenities(new HashSet<>(basicAmenities));
        roomTypeList.add(hcmSuperior);
        roomTypes.put("hcm_superior", hcmSuperior);
        
        RoomType hcmDeluxeRiver = RoomType.builder()
                .branch(hcm)
                .name("Deluxe River View")
                .code("DRV")
                .basePrice(new BigDecimal("2200000"))
                .capacityAdults(2)
                .capacityChildren(1)
                .maxOccupancy(3)
                .sizeM2(40.0)
                .bedType("King")
                .numberOfBeds(1)
                .description("Phòng Deluxe view sông Sài Gòn 40m2")
                .build();
        hcmDeluxeRiver.setAmenities(new HashSet<>(premiumAmenities));
        roomTypeList.add(hcmDeluxeRiver);
        roomTypes.put("hcm_deluxe_river", hcmDeluxeRiver);
        
        RoomType hcmFamily = RoomType.builder()
                .branch(hcm)
                .name("Family Suite")
                .code("FAM")
                .basePrice(new BigDecimal("4500000"))
                .capacityAdults(3)
                .capacityChildren(2)
                .maxOccupancy(5)
                .sizeM2(80.0)
                .bedType("King + 2 Twin")
                .numberOfBeds(3)
                .description("Suite gia đình 2 phòng ngủ 80m2")
                .build();
        hcmFamily.setAmenities(new HashSet<>(allAmenities));
        roomTypeList.add(hcmFamily);
        roomTypes.put("hcm_family", hcmFamily);
        
        RoomType hcmPenthouse = RoomType.builder()
                .branch(hcm)
                .name("Royal Penthouse")
                .code("PEN")
                .basePrice(new BigDecimal("12000000"))
                .capacityAdults(4)
                .capacityChildren(2)
                .maxOccupancy(6)
                .sizeM2(150.0)
                .bedType("King + Queen + Sofa")
                .numberOfBeds(3)
                .description("Penthouse sang trọng tầng 40 - 150m2")
                .build();
        hcmPenthouse.setAmenities(new HashSet<>(allAmenities));
        roomTypeList.add(hcmPenthouse);
        roomTypes.put("hcm_penthouse", hcmPenthouse);
        
        // Da Nang Room Types
        RoomType danangBeach = RoomType.builder()
                .branch(danang)
                .name("Beach View Room")
                .code("BCH")
                .basePrice(new BigDecimal("1800000"))
                .capacityAdults(2)
                .capacityChildren(1)
                .maxOccupancy(3)
                .sizeM2(35.0)
                .bedType("King")
                .numberOfBeds(1)
                .description("Phòng view biển trực diện 35m2")
                .build();
        danangBeach.setAmenities(new HashSet<>(premiumAmenities));
        roomTypeList.add(danangBeach);
        roomTypes.put("danang_beach", danangBeach);
        
        RoomType danangOcean = RoomType.builder()
                .branch(danang)
                .name("Ocean Front Deluxe")
                .code("OCN")
                .basePrice(new BigDecimal("2800000"))
                .capacityAdults(2)
                .capacityChildren(1)
                .maxOccupancy(3)
                .sizeM2(50.0)
                .bedType("King")
                .numberOfBeds(1)
                .description("Phòng Deluxe view biển với ban công 50m2")
                .build();
        danangOcean.setAmenities(new HashSet<>(allAmenities));
        roomTypeList.add(danangOcean);
        roomTypes.put("danang_ocean", danangOcean);
        
        RoomType danangVilla = RoomType.builder()
                .branch(danang)
                .name("Beach Villa")
                .code("VIL")
                .basePrice(new BigDecimal("6000000"))
                .capacityAdults(4)
                .capacityChildren(2)
                .maxOccupancy(6)
                .sizeM2(100.0)
                .bedType("King + Queen")
                .numberOfBeds(2)
                .description("Villa riêng biệt gần biển 100m2")
                .build();
        danangVilla.setAmenities(new HashSet<>(allAmenities));
        roomTypeList.add(danangVilla);
        roomTypes.put("danang_villa", danangVilla);
        
        roomTypeRepository.saveAll(roomTypeList);
        log.info("   ✅ Seeded {} room types", roomTypeList.size());
        return roomTypes;
    }

    // =========================================================================
    // ROOMS
    // =========================================================================
    
    public Map<String, Room> seedRooms(Map<String, Branch> branches, Map<String, RoomType> roomTypes) {
        // Idempotency check
        if (roomRepository.count() > 0) {
            log.info("   ⏭️  Rooms already exist (count: {}), skipping...", roomRepository.count());
            return new HashMap<>(); // Return empty map since we load entities directly now
        }
        
        // Load branches directly from DB to ensure they are managed entities
        Branch hanoi = branchRepository.findByCode("AUR-HN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HN not found"));
        Branch hcm = branchRepository.findByCode("AUR-HCM")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HCM not found"));
        Branch danang = branchRepository.findByCode("AUR-DN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-DN not found"));
        
        // Load room types by branch to avoid lazy loading issues
        Map<String, RoomType> roomTypesMap = new HashMap<>();
        
        // Get Hanoi room types
        List<RoomType> hanoiRoomTypes = roomTypeRepository.findByBranchId(hanoi.getId());
        for (RoomType rt : hanoiRoomTypes) {
            roomTypesMap.put("hn_" + rt.getCode().toLowerCase(), rt);
        }
        
        // Get HCM room types
        List<RoomType> hcmRoomTypes = roomTypeRepository.findByBranchId(hcm.getId());
        for (RoomType rt : hcmRoomTypes) {
            roomTypesMap.put("hcm_" + rt.getCode().toLowerCase(), rt);
        }
        
        // Get Danang room types
        List<RoomType> danangRoomTypes = roomTypeRepository.findByBranchId(danang.getId());
        for (RoomType rt : danangRoomTypes) {
            roomTypesMap.put("dn_" + rt.getCode().toLowerCase(), rt);
        }
        
        Map<String, Room> rooms = new HashMap<>();
        List<Room> roomList = new ArrayList<>();
        
        // Hanoi Rooms (15 rooms across 4 types)
        RoomType hanoiDeluxe = roomTypesMap.get("hn_dlx");
        RoomType hanoiExecutive = roomTypesMap.get("hn_exe");
        RoomType hanoiJunior = roomTypesMap.get("hn_jrs");
        RoomType hanoiPresidential = roomTypesMap.get("hn_prs");
        
        for (int i = 1; i <= 5; i++) {
            Room room = Room.builder()
                    .branch(hanoi)
                    .roomType(hanoiDeluxe)
                    .roomNumber("10" + String.format("%02d", i))
                    .floor(10)
                    .status(i <= 3 ? Room.RoomStatus.AVAILABLE : Room.RoomStatus.OCCUPIED)
                    .build();
            roomList.add(room);
            rooms.put("hanoi_deluxe_" + i, room);
        }
        
        for (int i = 1; i <= 4; i++) {
            Room room = Room.builder()
                    .branch(hanoi)
                    .roomType(hanoiExecutive)
                    .roomNumber("15" + String.format("%02d", i))
                    .floor(15)
                    .status(i <= 2 ? Room.RoomStatus.AVAILABLE : Room.RoomStatus.RESERVED)
                    .build();
            roomList.add(room);
            rooms.put("hanoi_exec_" + i, room);
        }
        
        for (int i = 1; i <= 3; i++) {
            Room room = Room.builder()
                    .branch(hanoi)
                    .roomType(hanoiJunior)
                    .roomNumber("20" + String.format("%02d", i))
                    .floor(20)
                    .status(Room.RoomStatus.AVAILABLE)
                    .build();
            roomList.add(room);
            rooms.put("hanoi_junior_" + i, room);
        }
        
        Room hanoiPres = Room.builder()
                .branch(hanoi)
                .roomType(hanoiPresidential)
                .roomNumber("3001")
                .floor(30)
                .status(Room.RoomStatus.AVAILABLE)
                .maintenanceNotes("Premium suite - requires special attention")
                .build();
        roomList.add(hanoiPres);
        rooms.put("hanoi_pres", hanoiPres);
        
        // HCM Rooms (10 rooms)
        RoomType hcmSuperior = roomTypesMap.get("hcm_sup");
        RoomType hcmDeluxe = roomTypesMap.get("hcm_dlx");
        RoomType hcmFamily = roomTypesMap.get("hcm_fml");
        
        for (int i = 1; i <= 4; i++) {
            Room room = Room.builder()
                    .branch(hcm)
                    .roomType(hcmSuperior)
                    .roomNumber("50" + String.format("%02d", i))
                    .floor(5)
                    .status(Room.RoomStatus.AVAILABLE)
                    .build();
            roomList.add(room);
            rooms.put("hcm_sup_" + i, room);
        }
        
        for (int i = 1; i <= 4; i++) {
            Room room = Room.builder()
                    .branch(hcm)
                    .roomType(hcmDeluxe)
                    .roomNumber("80" + String.format("%02d", i))
                    .floor(8)
                    .status(i == 1 ? Room.RoomStatus.CLEANING : Room.RoomStatus.AVAILABLE)
                    .build();
            roomList.add(room);
            rooms.put("hcm_deluxe_" + i, room);
        }
        
        for (int i = 1; i <= 2; i++) {
            Room room = Room.builder()
                    .branch(hcm)
                    .roomType(hcmFamily)
                    .roomNumber("120" + i)
                    .floor(12)
                    .status(Room.RoomStatus.AVAILABLE)
                    .build();
            roomList.add(room);
            rooms.put("hcm_family_" + i, room);
        }
        
        // Da Nang Rooms (8 rooms)
        RoomType danangBeach = roomTypesMap.get("dn_bch");
        RoomType danangOcean = roomTypesMap.get("dn_ocn");
        RoomType danangVilla = roomTypesMap.get("dn_vil");
        
        for (int i = 1; i <= 3; i++) {
            Room room = Room.builder()
                    .branch(danang)
                    .roomType(danangBeach)
                    .roomNumber("20" + String.format("%02d", i))
                    .floor(2)
                    .status(Room.RoomStatus.AVAILABLE)
                    .build();
            roomList.add(room);
            rooms.put("danang_beach_" + i, room);
        }
        
        for (int i = 1; i <= 3; i++) {
            Room room = Room.builder()
                    .branch(danang)
                    .roomType(danangOcean)
                    .roomNumber("30" + String.format("%02d", i))
                    .floor(3)
                    .status(Room.RoomStatus.AVAILABLE)
                    .build();
            roomList.add(room);
            rooms.put("danang_ocean_" + i, room);
        }
        
        for (int i = 1; i <= 2; i++) {
            Room room = Room.builder()
                    .branch(danang)
                    .roomType(danangVilla)
                    .roomNumber("V10" + i)
                    .floor(1)
                    .status(Room.RoomStatus.AVAILABLE)
                    .maintenanceNotes("Private villa - check garden maintenance weekly")
                    .build();
            roomList.add(room);
            rooms.put("danang_villa_" + i, room);
        }
        
        roomRepository.saveAll(roomList);
        log.info("   ✅ Seeded {} rooms", roomList.size());
        return rooms;
    }

    // =========================================================================
    // SERVICES
    // =========================================================================
    
    public Map<String, Service> seedServices(Map<String, Branch> branches) {
        // Idempotency check
        if (serviceRepository.count() > 0) {
            log.info("   ⏭️  Services already exist (count: {}), skipping...", serviceRepository.count());
            Map<String, Service> services = new HashMap<>();
            serviceRepository.findAll().forEach(s -> 
                services.put(s.getName().toLowerCase().replace(" ", "_"), s)
            );
            return services;
        }
        
        // Load branches directly from DB to ensure they are managed entities
        Branch hanoi = branchRepository.findByCode("AUR-HN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HN not found"));
        
        Map<String, Service> services = new HashMap<>();
        List<Service> serviceList = new ArrayList<>();
        
        Service airport = Service.builder()
                .branch(hanoi)
                .name("Airport Transfer")
                .type(Service.ServiceType.AIRPORT_TRANSFER)
                .description("Đưa đón sân bay Nội Bài - Khách sạn (1 chiều)")
                .basePrice(new BigDecimal("500000"))
                .unit("trip")
                .active(true)
                .requiresBooking(true)
                .build();
        serviceList.add(airport);
        services.put("airport", airport);
        
        Service laundry = Service.builder()
                .branch(hanoi)
                .name("Laundry Service")
                .type(Service.ServiceType.LAUNDRY)
                .description("Giặt là quần áo cao cấp")
                .basePrice(new BigDecimal("50000"))
                .unit("kg")
                .active(true)
                .requiresBooking(false)
                .build();
        serviceList.add(laundry);
        services.put("laundry", laundry);
        
        Service roomService = Service.builder()
                .branch(hanoi)
                .name("24/7 Room Service")
                .type(Service.ServiceType.ROOM_SERVICE)
                .description("Phục vụ đồ ăn uống tại phòng 24/7")
                .basePrice(new BigDecimal("350000"))
                .unit("order")
                .active(true)
                .requiresBooking(false)
                .build();
        serviceList.add(roomService);
        services.put("room_service", roomService);
        
        Service spa = Service.builder()
                .branch(hanoi)
                .name("Spa & Massage")
                .type(Service.ServiceType.SPA)
                .description("Liệu trình spa thư giãn 90 phút")
                .basePrice(new BigDecimal("800000"))
                .unit("session")
                .active(true)
                .requiresBooking(true)
                .build();
        serviceList.add(spa);
        services.put("spa", spa);
        
        Service tour = Service.builder()
                .branch(hanoi)
                .name("City Tour")
                .type(Service.ServiceType.TOUR)
                .description("Tour tham quan Hà Nội 1 ngày")
                .basePrice(new BigDecimal("1200000"))
                .unit("person")
                .active(true)
                .requiresBooking(true)
                .build();
        serviceList.add(tour);
        services.put("tour", tour);
        
        Service babysitting = Service.builder()
                .branch(hanoi)
                .name("Baby Sitting")
                .type(Service.ServiceType.OTHER)
                .description("Dịch vụ trông trẻ chuyên nghiệp")
                .basePrice(new BigDecimal("200000"))
                .unit("hour")
                .active(true)
                .requiresBooking(true)
                .build();
        serviceList.add(babysitting);
        services.put("babysitting", babysitting);
        
        Service chef = Service.builder()
                .branch(hanoi)
                .name("Private Chef")
                .type(Service.ServiceType.RESTAURANT)
                .description("Đầu bếp riêng phục vụ bữa tối tại phòng")
                .basePrice(new BigDecimal("3000000"))
                .unit("meal")
                .active(true)
                .requiresBooking(true)
                .build();
        serviceList.add(chef);
        services.put("chef", chef);
        
        Service flowers = Service.builder()
                .branch(hanoi)
                .name("Flower Decoration")
                .type(Service.ServiceType.OTHER)
                .description("Trang trí hoa tươi cho dịp đặc biệt")
                .basePrice(new BigDecimal("1500000"))
                .unit("set")
                .active(true)
                .requiresBooking(true)
                .build();
        serviceList.add(flowers);
        services.put("flowers", flowers);
        
        serviceRepository.saveAll(serviceList);
        log.info("   ✅ Seeded {} services", serviceList.size());
        return services;
    }

    // =========================================================================
    // PROMOTIONS
    // =========================================================================
    
    public Map<String, Promotion> seedPromotions(Map<String, Branch> branches) {
        // Idempotency check
        if (promotionRepository.count() > 0) {
            log.info("   ⏭️  Promotions already exist (count: {}), skipping...", promotionRepository.count());
            Map<String, Promotion> promotions = new HashMap<>();
            promotionRepository.findAll().forEach(p -> 
                promotions.put(p.getCode().toLowerCase(), p)
            );
            return promotions;
        }
        
        // Load branches directly from DB to ensure they are managed entities
        Branch hanoi = branchRepository.findByCode("AUR-HN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HN not found"));
        Branch hcm = branchRepository.findByCode("AUR-HCM")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HCM not found"));
        
        Map<String, Promotion> promotions = new HashMap<>();
        List<Promotion> promotionList = new ArrayList<>();
        
        Promotion summer = Promotion.builder()
                .branch(hanoi)
                .code("SUMMER2024")
                .name("Summer Vacation 2024")
                .description("Giảm 20% cho booking từ 3 đêm trở lên")
                .discountType(Promotion.DiscountType.PERCENTAGE)
                .percentOff(new BigDecimal("20.0"))
                .minBookingAmount(new BigDecimal("5000000"))
                .maxDiscountAmount(new BigDecimal("2000000"))
                .startAt(LocalDate.now().minusDays(30))
                .endAt(LocalDate.now().plusDays(60))
                .active(true)
                .build();
        promotionList.add(summer);
        promotions.put("summer", summer);
        
        Promotion welcome = Promotion.builder()
                .branch(hanoi)
                .code("WELCOME50")
                .name("Welcome New Customer")
                .description("Giảm 500k cho khách hàng mới")
                .discountType(Promotion.DiscountType.FIXED_AMOUNT)
                .amountOff(new BigDecimal("500000"))
                .minBookingAmount(new BigDecimal("3000000"))
                .startAt(LocalDate.now().minusDays(10))
                .endAt(LocalDate.now().plusDays(90))
                .active(true)
                .build();
        promotionList.add(welcome);
        promotions.put("welcome", welcome);
        
        Promotion earlybird = Promotion.builder()
                .branch(hcm)
                .code("EARLYBIRD")
                .name("Early Bird Special")
                .description("Giảm 15% cho booking trước 30 ngày")
                .discountType(Promotion.DiscountType.PERCENTAGE)
                .percentOff(new BigDecimal("15.0"))
                .minBookingAmount(new BigDecimal("4000000"))
                .maxDiscountAmount(new BigDecimal("1500000"))
                .startAt(LocalDate.now().minusDays(20))
                .endAt(LocalDate.now().plusDays(120))
                .active(true)
                .build();
        promotionList.add(earlybird);
        promotions.put("earlybird", earlybird);
        
        Promotion weekend = Promotion.builder()
                .branch(hcm)
                .code("WEEKEND30")
                .name("Weekend Getaway")
                .description("Giảm 30% cho booking cuối tuần")
                .discountType(Promotion.DiscountType.PERCENTAGE)
                .percentOff(new BigDecimal("30.0"))
                .minBookingAmount(new BigDecimal("3000000"))
                .maxDiscountAmount(new BigDecimal("1000000"))
                .startAt(LocalDate.now().minusDays(5))
                .endAt(LocalDate.now().plusDays(45))
                .active(true)
                .build();
        promotionList.add(weekend);
        promotions.put("weekend", weekend);
        
        Promotion loyalty = Promotion.builder()
                .branch(hanoi)
                .code("LOYAL1M")
                .name("Loyalty Reward")
                .description("Giảm 1 triệu cho khách hàng thân thiết")
                .discountType(Promotion.DiscountType.FIXED_AMOUNT)
                .amountOff(new BigDecimal("1000000"))
                .minBookingAmount(new BigDecimal("8000000"))
                .startAt(LocalDate.now().minusDays(15))
                .endAt(LocalDate.now().plusDays(180))
                .active(true)
                .build();
        promotionList.add(loyalty);
        promotions.put("loyalty", loyalty);
        
        Promotion expired = Promotion.builder()
                .branch(hanoi)
                .code("NEWYEAR")
                .name("New Year 2024")
                .description("Giảm 25% đã hết hạn")
                .discountType(Promotion.DiscountType.PERCENTAGE)
                .percentOff(new BigDecimal("25.0"))
                .minBookingAmount(new BigDecimal("5000000"))
                .maxDiscountAmount(new BigDecimal("2500000"))
                .startAt(LocalDate.now().minusDays(90))
                .endAt(LocalDate.now().minusDays(30))
                .active(false)
                .build();
        promotionList.add(expired);
        promotions.put("expired", expired);
        
        promotionRepository.saveAll(promotionList);
        log.info("   ✅ Seeded {} promotions", promotionList.size());
        return promotions;
    }

    // =========================================================================
    // BOOKINGS
    // =========================================================================
    
    public Map<String, Booking> seedBookings(Map<String, Branch> branches, User customer, Map<String, Promotion> promotions) {
        // Idempotency check
        if (bookingRepository.count() > 0) {
            log.info("   ⏭️  Bookings already exist (count: {}), skipping...", bookingRepository.count());
            Map<String, Booking> bookings = new HashMap<>();
            List<Booking> allBookings = bookingRepository.findAll();
            // Use index-based keys to match the seeding logic
            for (int i = 0; i < allBookings.size() && i < 5; i++) {
                bookings.put("b" + (i + 1), allBookings.get(i));
            }
            return bookings;
        }
        
        // Load branches directly from DB to ensure they are managed entities
        Branch hanoi = branchRepository.findByCode("AUR-HN")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HN not found"));
        Branch hcm = branchRepository.findByCode("AUR-HCM")
                .orElseThrow(() -> new RuntimeException("Branch AUR-HCM not found"));
        
        // Load promotions from DB
        List<Promotion> allPromotions = promotionRepository.findAll();
        Promotion summer = allPromotions.stream()
                .filter(p -> p.getCode().equalsIgnoreCase("SUMMER2024"))
                .findFirst().orElse(null);
        Promotion welcome = allPromotions.stream()
                .filter(p -> p.getCode().equalsIgnoreCase("WELCOME50"))
                .findFirst().orElse(null);
        
        Map<String, Booking> bookings = new HashMap<>();
        List<Booking> bookingList = new ArrayList<>();
        
        // Booking 1: CONFIRMED with promotion
        Booking b1 = Booking.builder()
                .branch(hanoi)
                .customer(customer)
                .appliedPromotion(summer)
                .bookingCode("BK-001-" + System.currentTimeMillis())
                .checkin(LocalDate.now().plusDays(5))
                .checkout(LocalDate.now().plusDays(8))
                .specialRequest("Phòng tầng cao, view đẹp. Early check-in nếu có thể")
                .status(Booking.BookingStatus.CONFIRMED)
                .subtotalPrice(new BigDecimal("9000000"))
                .discountAmount(new BigDecimal("1800000"))
                .totalPrice(new BigDecimal("7200000"))
                .build();
        bookingList.add(b1);
        bookings.put("b1", b1);
        
        // Booking 2: CHECKED_IN
        Booking b2 = Booking.builder()
                .branch(hanoi)
                .customer(customer)
                .bookingCode("BK-002-" + System.currentTimeMillis())
                .checkin(LocalDate.now().minusDays(2))
                .checkout(LocalDate.now().plusDays(3))
                .status(Booking.BookingStatus.CHECKED_IN)
                .subtotalPrice(new BigDecimal("12500000"))
                .discountAmount(BigDecimal.ZERO)
                .totalPrice(new BigDecimal("12500000"))
                .build();
        bookingList.add(b2);
        bookings.put("b2", b2);
        
        // Booking 3: CHECKED_OUT (completed)
        Booking b3 = Booking.builder()
                .branch(hcm)
                .customer(customer)
                .appliedPromotion(welcome)
                .bookingCode("BK-003-" + System.currentTimeMillis())
                .checkin(LocalDate.now().minusDays(10))
                .checkout(LocalDate.now().minusDays(7))
                .status(Booking.BookingStatus.CHECKED_OUT)
                .subtotalPrice(new BigDecimal("3900000"))
                .discountAmount(new BigDecimal("500000"))
                .totalPrice(new BigDecimal("3400000"))
                .build();
        bookingList.add(b3);
        bookings.put("b3", b3);
        
        // Booking 4: PENDING
        Booking b4 = Booking.builder()
                .branch(hanoi)
                .customer(customer)
                .bookingCode("BK-004-" + System.currentTimeMillis())
                .checkin(LocalDate.now().plusDays(15))
                .checkout(LocalDate.now().plusDays(17))
                .status(Booking.BookingStatus.PENDING)
                .subtotalPrice(new BigDecimal("7000000"))
                .discountAmount(BigDecimal.ZERO)
                .totalPrice(new BigDecimal("7000000"))
                .build();
        bookingList.add(b4);
        bookings.put("b4", b4);
        
        // Booking 5: CANCELLED
        Booking b5 = Booking.builder()
                .branch(hcm)
                .customer(customer)
                .bookingCode("BK-005-" + System.currentTimeMillis())
                .checkin(LocalDate.now().plusDays(30))
                .checkout(LocalDate.now().plusDays(33))
                .specialRequest("Khách hủy vì lý do cá nhân")
                .status(Booking.BookingStatus.CANCELLED)
                .subtotalPrice(new BigDecimal("6600000"))
                .discountAmount(BigDecimal.ZERO)
                .totalPrice(new BigDecimal("6600000"))
                .build();
        bookingList.add(b5);
        bookings.put("b5", b5);
        
        bookingRepository.saveAll(bookingList);
        log.info("   ✅ Seeded {} bookings", bookingList.size());
        return bookings;
    }

    // =========================================================================
    // BOOKING ROOMS
    // =========================================================================
    
    public void seedBookingRooms(Map<String, Booking> bookings, Map<String, Room> rooms) {
        // Idempotency check
        if (bookingRoomRepository.count() > 0) {
            log.info("   ⏭️  Booking rooms already exist (count: {}), skipping...", bookingRoomRepository.count());
            return;
        }
        
        // Load bookings from DB
        List<Booking> allBookings = bookingRepository.findAll();
        if (allBookings.size() < 5) {
            log.warn("   ⚠️  Not enough bookings to seed booking rooms (found: {})", allBookings.size());
            return;
        }
        
        // Load rooms from DB
        List<Room> allRooms = roomRepository.findAll();
        if (allRooms.isEmpty()) {
            log.warn("   ⚠️  No rooms found to seed booking rooms");
            return;
        }
        
        List<BookingRoom> bookingRooms = new ArrayList<>();
        
        // Get specific rooms by room number
        Room room1001 = allRooms.stream().filter(r -> r.getRoomNumber().equals("1001")).findFirst().orElse(null);
        Room room1501 = allRooms.stream().filter(r -> r.getRoomNumber().equals("1501")).findFirst().orElse(null);
        Room room2001 = allRooms.stream().filter(r -> r.getRoomNumber().equals("2001")).findFirst().orElse(null);
        Room room5001 = allRooms.stream().filter(r -> r.getRoomNumber().equals("5001")).findFirst().orElse(null);
        
        if (room1001 == null || room1501 == null) {
            log.warn("   ⚠️  Required rooms not found for booking rooms");
            return;
        }
        
        // B1: 3 nights, 2 rooms
        BookingRoom br1 = BookingRoom.builder()
                .booking(allBookings.get(0))
                .room(room1001)
                .nights(3)
                .pricePerNight(new BigDecimal("1500000"))
                .totalAmount(new BigDecimal("4500000"))
                .build();
        bookingRooms.add(br1);
        
        BookingRoom br2 = BookingRoom.builder()
                .booking(allBookings.get(0))
                .room(room1501)
                .nights(3)
                .pricePerNight(new BigDecimal("2500000"))
                .totalAmount(new BigDecimal("7500000"))
                .build();
        bookingRooms.add(br2);
        
        // B2: 5 nights, 1 room
        if (room2001 != null) {
            BookingRoom br3 = BookingRoom.builder()
                    .booking(allBookings.get(1))
                    .room(room2001)
                    .nights(5)
                    .pricePerNight(new BigDecimal("3500000"))
                    .totalAmount(new BigDecimal("17500000"))
                    .build();
            bookingRooms.add(br3);
        }
        
        // B3: 3 nights, 1 room
        if (room5001 != null) {
            BookingRoom br4 = BookingRoom.builder()
                    .booking(allBookings.get(2))
                    .room(room5001)
                    .nights(3)
                    .pricePerNight(new BigDecimal("1300000"))
                    .totalAmount(new BigDecimal("3900000"))
                    .build();
            bookingRooms.add(br4);
        }
        
        bookingRoomRepository.saveAll(bookingRooms);
        log.info("   ✅ Seeded {} booking rooms", bookingRooms.size());
    }

    // =========================================================================
    // SERVICE BOOKINGS
    // =========================================================================
    
    public void seedServiceBookings(Map<String, Booking> bookings, Map<String, Service> services, User customer) {
        // Idempotency check
        if (serviceBookingRepository.count() > 0) {
            log.info("   ⏭️  Service bookings already exist (count: {}), skipping...", serviceBookingRepository.count());
            return;
        }
        
        // Load bookings from DB
        List<Booking> allBookings = bookingRepository.findAll();
        if (allBookings.size() < 3) {
            log.warn("   ⚠️  Not enough bookings to seed service bookings");
            return;
        }
        
        // Load services from DB
        List<Service> allServices = serviceRepository.findAll();
        if (allServices.isEmpty()) {
            log.warn("   ⚠️  No services found to seed service bookings");
            return;
        }
        
        // Find specific services
        Service airport = allServices.stream()
                .filter(s -> s.getType() == Service.ServiceType.AIRPORT_TRANSFER)
                .findFirst().orElse(null);
        Service spa = allServices.stream()
                .filter(s -> s.getType() == Service.ServiceType.SPA)
                .findFirst().orElse(null);
        
        if (airport == null || spa == null) {
            log.warn("   ⚠️  Required services not found");
            return;
        }
        
        List<ServiceBooking> serviceBookings = new ArrayList<>();
        
        // B1: Airport transfer + Spa
        ServiceBooking sb1 = ServiceBooking.builder()
                .booking(allBookings.get(0))
                .service(airport)
                .customer(customer)
                .quantity(1)
                .pricePerUnit(new BigDecimal("500000"))
                .totalPrice(new BigDecimal("500000"))
                .serviceDateTime(LocalDateTime.now().plusDays(5).withHour(14).withMinute(0))
                .status(ServiceBooking.ServiceBookingStatus.CONFIRMED)
                .specialInstructions("Pickup at airport terminal 1")
                .build();
        serviceBookings.add(sb1);
        
        ServiceBooking sb2 = ServiceBooking.builder()
                .booking(allBookings.get(0))
                .service(spa)
                .customer(customer)
                .quantity(2)
                .pricePerUnit(new BigDecimal("800000"))
                .totalPrice(new BigDecimal("1600000"))
                .serviceDateTime(LocalDateTime.now().plusDays(6).withHour(15).withMinute(0))
                .status(ServiceBooking.ServiceBookingStatus.CONFIRMED)
                .specialInstructions("Couple massage session")
                .build();
        serviceBookings.add(sb2);
        
        // B2: Spa
        if (allBookings.size() > 1) {
            ServiceBooking sb3 = ServiceBooking.builder()
                    .booking(allBookings.get(1))
                    .service(spa)
                    .customer(customer)
                    .quantity(1)
                    .pricePerUnit(new BigDecimal("800000"))
                    .totalPrice(new BigDecimal("800000"))
                    .serviceDateTime(LocalDateTime.now().withHour(15).withMinute(0))
                    .status(ServiceBooking.ServiceBookingStatus.CONFIRMED)
                    .build();
            serviceBookings.add(sb3);
        }
        
        // B3: Spa (completed)
        if (allBookings.size() > 2) {
            ServiceBooking sb4 = ServiceBooking.builder()
                    .booking(allBookings.get(2))
                    .service(spa)
                    .customer(customer)
                    .quantity(1)
                    .pricePerUnit(new BigDecimal("800000"))
                    .totalPrice(new BigDecimal("800000"))
                    .serviceDateTime(LocalDateTime.now().minusDays(8).withHour(16).withMinute(0))
                    .status(ServiceBooking.ServiceBookingStatus.COMPLETED)
                    .build();
            serviceBookings.add(sb4);
            
            // B3: Airport return
            ServiceBooking sb5 = ServiceBooking.builder()
                    .booking(allBookings.get(2))
                    .service(airport)
                    .customer(customer)
                    .quantity(1)
                    .pricePerUnit(new BigDecimal("500000"))
                    .totalPrice(new BigDecimal("500000"))
                    .serviceDateTime(LocalDateTime.now().minusDays(7).withHour(10).withMinute(0))
                    .status(ServiceBooking.ServiceBookingStatus.COMPLETED)
                    .specialInstructions("Drop off at airport terminal 2")
                    .build();
            serviceBookings.add(sb5);
        }
        
        serviceBookingRepository.saveAll(serviceBookings);
        log.info("   ✅ Seeded {} service bookings", serviceBookings.size());
    }

    // =========================================================================
    // PAYMENTS
    // =========================================================================
    
    public void seedPayments(Map<String, Booking> bookings) {
        // Idempotency check
        if (paymentRepository.count() > 0) {
            log.info("   ⏭️  Payments already exist (count: {}), skipping...", paymentRepository.count());
            return;
        }
        
        // Load bookings from DB
        List<Booking> allBookings = bookingRepository.findAll();
        if (allBookings.size() < 3) {
            log.warn("   ⚠️  Not enough bookings to seed payments");
            return;
        }
        
        List<Payment> payments = new ArrayList<>();
        
        // B1: Partial payment (deposit)
        Payment p1 = Payment.builder()
                .booking(allBookings.get(0))
                .amount(new BigDecimal("3600000"))
                .method(Payment.PaymentMethod.BANK_TRANSFER)
                .status(Payment.PaymentStatus.SUCCESS)
                .providerTxnId("TXN-" + System.currentTimeMillis() + "-001")
                .paidAt(LocalDateTime.now().minusDays(3))
                .notes("Deposit 50% for booking BK-001")
                .build();
        payments.add(p1);
        
        // B1: Remaining payment (pending)
        Payment p2 = Payment.builder()
                .booking(allBookings.get(0))
                .amount(new BigDecimal("3600000"))
                .method(Payment.PaymentMethod.BANK_TRANSFER)
                .status(Payment.PaymentStatus.PENDING)
                .notes("Remaining 50% for booking BK-001")
                .build();
        payments.add(p2);
        
        // B2: Full payment
        if (allBookings.size() > 1) {
            Payment p3 = Payment.builder()
                    .booking(allBookings.get(1))
                    .amount(new BigDecimal("12500000"))
                    .method(Payment.PaymentMethod.CARD)
                    .status(Payment.PaymentStatus.SUCCESS)
                    .providerTxnId("TXN-" + System.currentTimeMillis() + "-002")
                    .paidAt(LocalDateTime.now().minusDays(2))
                    .notes("Full payment at check-in")
                    .build();
            payments.add(p3);
        }
        
        // B3: Full payment (completed booking)
        if (allBookings.size() > 2) {
            Payment p4 = Payment.builder()
                    .booking(allBookings.get(2))
                    .amount(new BigDecimal("3400000"))
                    .method(Payment.PaymentMethod.CASH)
                    .status(Payment.PaymentStatus.SUCCESS)
                    .providerTxnId("CASH-" + System.currentTimeMillis() + "-003")
                    .paidAt(LocalDateTime.now().minusDays(10))
                    .notes("Cash payment on arrival")
                    .build();
            payments.add(p4);
            
            // B3: Service charges
            Payment p5 = Payment.builder()
                    .booking(allBookings.get(2))
                    .amount(new BigDecimal("1300000"))
                    .method(Payment.PaymentMethod.CASH)
                    .status(Payment.PaymentStatus.SUCCESS)
                    .providerTxnId("CASH-" + System.currentTimeMillis() + "-004")
                    .paidAt(LocalDateTime.now().minusDays(7))
                    .notes("Service charges (spa + airport)")
                    .build();
            payments.add(p5);
        }
        
        // B4: Pending payment
        if (allBookings.size() > 3) {
            Payment p6 = Payment.builder()
                    .booking(allBookings.get(3))
                    .amount(new BigDecimal("7000000"))
                    .method(Payment.PaymentMethod.BANK_TRANSFER)
                    .status(Payment.PaymentStatus.PENDING)
                    .notes("Awaiting payment for booking BK-004")
                    .build();
            payments.add(p6);
        }
        
        // B5: Refund (cancelled booking)
        if (allBookings.size() > 4) {
            Payment p7 = Payment.builder()
                    .booking(allBookings.get(4))
                    .amount(new BigDecimal("2000000")) // Original deposit amount
                    .refundAmount(new BigDecimal("1000000")) // Refund amount (minus cancellation fee)
                    .method(Payment.PaymentMethod.BANK_TRANSFER)
                    .status(Payment.PaymentStatus.REFUNDED)
                    .providerTxnId("REFUND-" + System.currentTimeMillis() + "-005")
                    .refundTxnId("REFUND-TXN-" + System.currentTimeMillis())
                    .paidAt(LocalDateTime.now().minusDays(1))
                    .refundedAt(LocalDateTime.now().minusDays(1))
                    .refundReason("Booking cancelled by customer")
                    .notes("Cancellation fee deducted - 1M VND from 2M deposit")
                    .build();
            payments.add(p7);
        }
        
        paymentRepository.saveAll(payments);
        log.info("   ✅ Seeded {} payments", payments.size());
    }

    // =========================================================================
    // REVIEWS
    // =========================================================================
    
    public void seedReviews(Map<String, Booking> bookings, User customer) {
        // Idempotency check
        if (reviewRepository.count() > 0) {
            log.info("   ⏭️  Reviews already exist (count: {}), skipping...", reviewRepository.count());
            return;
        }
        
        // Load bookings from DB - only get CHECKED_OUT bookings for reviews
        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> checkedOutBookings = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CHECKED_OUT || 
                             b.getStatus() == Booking.BookingStatus.COMPLETED)
                .toList();
        
        if (checkedOutBookings.isEmpty()) {
            log.warn("   ⚠️  No checked-out bookings found to seed reviews");
            return;
        }
        
        // Load branches and rooms
        List<Branch> branches = branchRepository.findAll();
        List<Room> rooms = roomRepository.findAll();
        
        if (branches.isEmpty() || rooms.isEmpty()) {
            log.warn("   ⚠️  No branches or rooms found to seed reviews");
            return;
        }
        
        List<Review> reviews = new ArrayList<>();
        
        // Review 1: APPROVED - 5 sao (cho booking đã checkout)
        if (checkedOutBookings.size() > 0) {
            Booking b = checkedOutBookings.get(0);
            Review r1 = Review.builder()
                    .booking(b)
                    .customer(customer)
                    .branch(b.getBranch())
                    .room(rooms.isEmpty() ? null : rooms.get(0))
                    .rating(5)
                    .comment("Trải nghiệm tuyệt vời! Phòng rất sạch sẽ và thoải mái. Nhân viên phục vụ nhiệt tình, chu đáo. View từ phòng đẹp tuyệt vời. Chắc chắn sẽ quay lại!")
                    .photos(Arrays.asList(
                        "https://example.com/reviews/room1.jpg",
                        "https://example.com/reviews/view1.jpg"
                    ))
                    .isVerified(true)
                    .helpfulCount(15)
                    .status(Review.ReviewStatus.APPROVED)
                    .reviewDate(LocalDateTime.now().minusDays(8))
                    .approvedAt(LocalDateTime.now().minusDays(7))
                    .approvedBy("manager")
                    .build();
            reviews.add(r1);
        }
        
        // Create more CHECKED_OUT bookings for testing if needed
        if (checkedOutBookings.size() < 3) {
            // Create additional checked-out bookings for review testing
            for (int i = checkedOutBookings.size(); i < 3 && i < allBookings.size(); i++) {
                Booking booking = allBookings.get(i);
                if (booking.getStatus() != Booking.BookingStatus.CHECKED_OUT) {
                    booking.setStatus(Booking.BookingStatus.CHECKED_OUT);
                    booking.setActualCheckoutTime(LocalDateTime.now().minusDays(10 + i));
                    bookingRepository.save(booking);
                    checkedOutBookings = bookingRepository.findAll().stream()
                        .filter(b -> b.getStatus() == Booking.BookingStatus.CHECKED_OUT || 
                                   b.getStatus() == Booking.BookingStatus.COMPLETED)
                        .toList();
                }
            }
        }
        
        // Review 2: APPROVED - 4 sao
        if (checkedOutBookings.size() > 1) {
            Booking b = checkedOutBookings.get(1);
            Review r2 = Review.builder()
                    .booking(b)
                    .customer(customer)
                    .branch(b.getBranch())
                    .room(rooms.size() > 1 ? rooms.get(1) : null)
                    .rating(4)
                    .comment("Khách sạn tốt, vị trí thuận lợi. Phòng rộng rãi và sạch sẽ. Dịch vụ ăn sáng phong phú. Tuy nhiên wifi hơi chậm. Nhìn chung đáng giá tiền.")
                    .photos(Arrays.asList(
                        "https://example.com/reviews/breakfast.jpg",
                        "https://example.com/reviews/room2.jpg",
                        "https://example.com/reviews/bathroom.jpg"
                    ))
                    .isVerified(true)
                    .helpfulCount(8)
                    .status(Review.ReviewStatus.APPROVED)
                    .reviewDate(LocalDateTime.now().minusDays(6))
                    .approvedAt(LocalDateTime.now().minusDays(5))
                    .approvedBy("manager")
                    .build();
            reviews.add(r2);
        }
        
        // Review 3: APPROVED - 5 sao với nhiều ảnh
        if (checkedOutBookings.size() > 2) {
            Booking b = checkedOutBookings.get(2);
            Review r3 = Review.builder()
                    .booking(b)
                    .customer(customer)
                    .branch(b.getBranch())
                    .room(rooms.size() > 2 ? rooms.get(2) : null)
                    .rating(5)
                    .comment("Xuất sắc! Đây là lần thứ 3 tôi ở đây và lần nào cũng hài lòng. Phòng được upgrade miễn phí. Spa rất tuyệt. Bể bơi sạch sẽ. Nhân viên luôn mỉm cười và sẵn sàng hỗ trợ.")
                    .photos(Arrays.asList(
                        "https://example.com/reviews/pool.jpg",
                        "https://example.com/reviews/spa.jpg",
                        "https://example.com/reviews/room_view.jpg",
                        "https://example.com/reviews/lobby.jpg",
                        "https://example.com/reviews/restaurant.jpg"
                    ))
                    .isVerified(true)
                    .helpfulCount(23)
                    .status(Review.ReviewStatus.APPROVED)
                    .reviewDate(LocalDateTime.now().minusDays(4))
                    .approvedAt(LocalDateTime.now().minusDays(3))
                    .approvedBy("admin")
                    .build();
            reviews.add(r3);
        }
        
        // Review 4: PENDING - Chờ duyệt
        if (checkedOutBookings.size() > 0) {
            // Create new checked out booking for pending review
            Branch branch = branches.isEmpty() ? null : branches.get(0);
            Booking newBooking = Booking.builder()
                    .branch(branch)
                    .customer(customer)
                    .bookingCode("BK-REV-" + System.currentTimeMillis())
                    .checkin(LocalDate.now().minusDays(5))
                    .checkout(LocalDate.now().minusDays(2))
                    .status(Booking.BookingStatus.CHECKED_OUT)
                    .actualCheckoutTime(LocalDateTime.now().minusDays(2))
                    .subtotalPrice(new BigDecimal("4500000"))
                    .discountAmount(BigDecimal.ZERO)
                    .totalPrice(new BigDecimal("4500000"))
                    .build();
            Booking savedBooking = bookingRepository.save(newBooking);
            
            Review r4 = Review.builder()
                    .booking(savedBooking)
                    .customer(customer)
                    .branch(savedBooking.getBranch())
                    .room(rooms.size() > 3 ? rooms.get(3) : null)
                    .rating(5)
                    .comment("Phòng đẹp, view tuyệt vời. Giường ngủ rất thoải mái. Ăn sáng ngon. Nhân viên thân thiện. Sẽ giới thiệu cho bạn bè.")
                    .photos(Arrays.asList(
                        "https://example.com/reviews/new_room.jpg"
                    ))
                    .isVerified(true)
                    .helpfulCount(0)
                    .status(Review.ReviewStatus.PENDING)
                    .reviewDate(LocalDateTime.now().minusHours(12))
                    .build();
            reviews.add(r4);
        }
        
        // Review 5: PENDING - Mới tạo
        if (checkedOutBookings.size() > 0) {
            // Create another checked out booking for pending review
            Branch branch = branches.size() > 1 ? branches.get(1) : branches.get(0);
            Booking newBooking2 = Booking.builder()
                    .branch(branch)
                    .customer(customer)
                    .bookingCode("BK-REV2-" + System.currentTimeMillis())
                    .checkin(LocalDate.now().minusDays(8))
                    .checkout(LocalDate.now().minusDays(6))
                    .status(Booking.BookingStatus.CHECKED_OUT)
                    .actualCheckoutTime(LocalDateTime.now().minusDays(6))
                    .subtotalPrice(new BigDecimal("3200000"))
                    .discountAmount(BigDecimal.ZERO)
                    .totalPrice(new BigDecimal("3200000"))
                    .build();
            Booking savedBooking2 = bookingRepository.save(newBooking2);
            
            Review r5 = Review.builder()
                    .booking(savedBooking2)
                    .customer(customer)
                    .branch(savedBooking2.getBranch())
                    .rating(4)
                    .comment("Khách sạn tốt, phòng sạch sẽ. Dịch vụ chu đáo. Vị trí thuận tiện. Giá cả hợp lý.")
                    .isVerified(true)
                    .helpfulCount(0)
                    .status(Review.ReviewStatus.PENDING)
                    .reviewDate(LocalDateTime.now().minusHours(6))
                    .build();
            reviews.add(r5);
        }
        
        // Review 6: REJECTED - Bị từ chối
        if (checkedOutBookings.size() > 0) {
            // Create another checked out booking for rejected review
            Branch branch = branches.size() > 1 ? branches.get(1) : branches.get(0);
            Booking newBooking3 = Booking.builder()
                    .branch(branch)
                    .customer(customer)
                    .bookingCode("BK-REV3-" + System.currentTimeMillis())
                    .checkin(LocalDate.now().minusDays(15))
                    .checkout(LocalDate.now().minusDays(12))
                    .status(Booking.BookingStatus.CHECKED_OUT)
                    .actualCheckoutTime(LocalDateTime.now().minusDays(12))
                    .subtotalPrice(new BigDecimal("2800000"))
                    .discountAmount(BigDecimal.ZERO)
                    .totalPrice(new BigDecimal("2800000"))
                    .build();
            Booking savedBooking3 = bookingRepository.save(newBooking3);
            
            Review r6 = Review.builder()
                    .booking(savedBooking3)
                    .customer(customer)
                    .branch(savedBooking3.getBranch())
                    .rating(2)
                    .comment("Không hài lòng lắm. Phòng nhỏ hơn mong đợi.")
                    .isVerified(true)
                    .helpfulCount(0)
                    .status(Review.ReviewStatus.REJECTED)
                    .reviewDate(LocalDateTime.now().minusDays(11))
                    .rejectionReason("Nội dung không đủ chi tiết và thiếu tính xây dựng")
                    .rejectedAt(LocalDateTime.now().minusDays(10))
                    .rejectedBy("manager")
                    .build();
            reviews.add(r6);
        }
        
        // Review 7: APPROVED - 3 sao (trung bình)
        if (checkedOutBookings.size() > 0) {
            Branch branch = branches.isEmpty() ? null : branches.get(0);
            Booking newBooking4 = Booking.builder()
                    .branch(branch)
                    .customer(customer)
                    .bookingCode("BK-REV4-" + System.currentTimeMillis())
                    .checkin(LocalDate.now().minusDays(20))
                    .checkout(LocalDate.now().minusDays(18))
                    .status(Booking.BookingStatus.CHECKED_OUT)
                    .actualCheckoutTime(LocalDateTime.now().minusDays(18))
                    .subtotalPrice(new BigDecimal("3500000"))
                    .discountAmount(BigDecimal.ZERO)
                    .totalPrice(new BigDecimal("3500000"))
                    .build();
            Booking savedBooking4 = bookingRepository.save(newBooking4);
            
            Review r7 = Review.builder()
                    .booking(savedBooking4)
                    .customer(customer)
                    .branch(savedBooking4.getBranch())
                    .room(rooms.size() > 4 ? rooms.get(4) : null)
                    .rating(3)
                    .comment("Khách sạn ở mức trung bình. Phòng sạch nhưng hơi cũ. Nhân viên thân thiện. Vị trí tốt nhưng giá hơi cao so với chất lượng. Cần cải thiện thêm về trang thiết bị.")
                    .photos(Arrays.asList(
                        "https://example.com/reviews/avg_room.jpg"
                    ))
                    .isVerified(true)
                    .helpfulCount(5)
                    .status(Review.ReviewStatus.APPROVED)
                    .reviewDate(LocalDateTime.now().minusDays(17))
                    .approvedAt(LocalDateTime.now().minusDays(16))
                    .approvedBy("manager")
                    .build();
            reviews.add(r7);
        }
        
        // Review 8: APPROVED - 4 sao (cho gia đình)
        if (checkedOutBookings.size() > 0) {
            Branch branch = branches.size() > 1 ? branches.get(1) : branches.get(0);
            Booking newBooking5 = Booking.builder()
                    .branch(branch)
                    .customer(customer)
                    .bookingCode("BK-REV5-" + System.currentTimeMillis())
                    .checkin(LocalDate.now().minusDays(25))
                    .checkout(LocalDate.now().minusDays(22))
                    .status(Booking.BookingStatus.CHECKED_OUT)
                    .actualCheckoutTime(LocalDateTime.now().minusDays(22))
                    .subtotalPrice(new BigDecimal("6500000"))
                    .discountAmount(BigDecimal.ZERO)
                    .totalPrice(new BigDecimal("6500000"))
                    .build();
            Booking savedBooking5 = bookingRepository.save(newBooking5);
            
            Review r8 = Review.builder()
                    .booking(savedBooking5)
                    .customer(customer)
                    .branch(savedBooking5.getBranch())
                    .room(rooms.size() > 5 ? rooms.get(5) : null)
                    .rating(4)
                    .comment("Rất phù hợp cho gia đình. Phòng rộng, có khu vui chơi cho trẻ em. Bể bơi sạch sẽ, con tôi rất thích. Nhân viên nhiệt tình. Buffet sáng đa dạng. Giá hợp lý cho gia đình.")
                    .photos(Arrays.asList(
                        "https://example.com/reviews/family_room.jpg",
                        "https://example.com/reviews/kids_area.jpg",
                        "https://example.com/reviews/pool_kids.jpg"
                    ))
                    .isVerified(true)
                    .helpfulCount(18)
                    .status(Review.ReviewStatus.APPROVED)
                    .reviewDate(LocalDateTime.now().minusDays(21))
                    .approvedAt(LocalDateTime.now().minusDays(20))
                    .approvedBy("manager")
                    .build();
            reviews.add(r8);
        }
        
        reviewRepository.saveAll(reviews);
        log.info("   ✅ Seeded {} reviews", reviews.size());
    }
}

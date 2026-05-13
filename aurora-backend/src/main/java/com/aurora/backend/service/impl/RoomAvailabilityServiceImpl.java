package com.aurora.backend.service.impl;

import com.aurora.backend.dto.response.RoomAvailabilityResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Room;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.RoomRepository;
import com.aurora.backend.service.RoomAvailabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomAvailabilityServiceImpl implements RoomAvailabilityService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    @Override
    public boolean isRoomAvailable(String roomId, LocalDate checkinDate, LocalDate checkoutDate, String excludeBookingId) {
        // Check for conflicting bookings
        List<String> conflicts = detectConflicts(roomId, checkinDate, checkoutDate, excludeBookingId);
        
        return conflicts.isEmpty();
    }

    @Override
    public Map<String, Boolean> checkMultipleRoomsAvailability(List<String> roomIds, LocalDate checkinDate, LocalDate checkoutDate) {
        Map<String, Boolean> availabilityMap = new HashMap<>();
        
        for (String roomId : roomIds) {
            boolean available = isRoomAvailable(roomId, checkinDate, checkoutDate, null);
            availabilityMap.put(roomId, available);
        }
        
        return availabilityMap;
    }

    @Override
    public List<Room> findAvailableRooms(String roomTypeId, LocalDate checkinDate, LocalDate checkoutDate, String branchId) {
        // Get all rooms of the specified type
        List<Room> rooms;
        if (branchId != null) {
            rooms = roomRepository.findByRoomTypeIdAndBranchId(roomTypeId, branchId);
        } else {
            rooms = roomRepository.findByRoomTypeId(roomTypeId);
        }

        // Filter available rooms
        return rooms.stream()
                .filter(room -> isRoomAvailable(room.getId(), checkinDate, checkoutDate, null))
                .collect(Collectors.toList());
    }

    @Override
    public RoomAvailabilityResponse getAvailabilityCalendar(String roomId, LocalDate startDate, LocalDate endDate) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        Map<LocalDate, Boolean> availabilityMap = new LinkedHashMap<>();
        int totalAvailable = 0;
        int totalBooked = 0;

        // Generate availability for each date
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            boolean available = isRoomAvailable(roomId, currentDate, currentDate.plusDays(1), null);
            availabilityMap.put(currentDate, available);
            
            if (available) {
                totalAvailable++;
            } else {
                totalBooked++;
            }
            
            currentDate = currentDate.plusDays(1);
        }

        return RoomAvailabilityResponse.builder()
                .roomId(roomId)
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType().getName())
                .startDate(startDate)
                .endDate(endDate)
                .availabilityMap(availabilityMap)
                .totalAvailableDays(totalAvailable)
                .totalBookedDays(totalBooked)
                .build();
    }

    @Override
    public List<String> detectConflicts(String roomId, LocalDate checkinDate, LocalDate checkoutDate, String excludeBookingId) {
        // Status that occupy the room
        List<Booking.BookingStatus> occupyingStatuses = Arrays.asList(
                Booking.BookingStatus.AWAITING_PAYMENT, // VNPay pending - holds the room for 20 min
                Booking.BookingStatus.PENDING,
                Booking.BookingStatus.CONFIRMED,
                Booking.BookingStatus.CHECKED_IN,
                Booking.BookingStatus.CHECKED_OUT // Still occupies until fully completed
        );

        if (excludeBookingId != null) {
            return bookingRepository.findConflictingBookingsExcluding(
                    roomId, checkinDate, checkoutDate, occupyingStatuses, excludeBookingId
            );
        } else {
            return bookingRepository.findConflictingBookings(
                    roomId, checkinDate, checkoutDate, occupyingStatuses
            );
        }
    }

    @Override
    public int countAvailableRooms(String roomTypeId, LocalDate checkinDate, LocalDate checkoutDate, String branchId) {
        List<Room> availableRooms = findAvailableRooms(roomTypeId, checkinDate, checkoutDate, branchId);
        return availableRooms.size();
    }

    @Override
    public void validateRoomAvailability(String roomId, LocalDate checkinDate, LocalDate checkoutDate, String excludeBookingId) {
        if (!isRoomAvailable(roomId, checkinDate, checkoutDate, excludeBookingId)) {
            throw new AppException(ErrorCode.ROOM_NOT_AVAILABLE);
        }
    }
}

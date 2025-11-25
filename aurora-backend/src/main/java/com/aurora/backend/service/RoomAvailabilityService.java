package com.aurora.backend.service;

import com.aurora.backend.dto.response.RoomAvailabilityResponse;
import com.aurora.backend.entity.Room;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface RoomAvailabilityService {

    boolean isRoomAvailable(String roomId, LocalDate checkinDate, LocalDate checkoutDate, String excludeBookingId);
    Map<String, Boolean> checkMultipleRoomsAvailability(List<String> roomIds, LocalDate checkinDate, LocalDate checkoutDate);
    List<Room> findAvailableRooms(String roomTypeId, LocalDate checkinDate, LocalDate checkoutDate, String branchId);
    RoomAvailabilityResponse getAvailabilityCalendar(String roomId, LocalDate startDate, LocalDate endDate);
    String lockRoom(String roomId, LocalDate checkinDate, LocalDate checkoutDate, String userId);
    boolean releaseRoomLock(String lockId);
    List<String> detectConflicts(String roomId, LocalDate checkinDate, LocalDate checkoutDate, String excludeBookingId);
    int countAvailableRooms(String roomTypeId, LocalDate checkinDate, LocalDate checkoutDate, String branchId);
    void validateRoomAvailability(String roomId, LocalDate checkinDate, LocalDate checkoutDate, String excludeBookingId);
    void clearExpiredLocks();
}

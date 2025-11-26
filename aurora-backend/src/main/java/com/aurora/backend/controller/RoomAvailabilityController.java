package com.aurora.backend.controller;

import com.aurora.backend.dto.request.CheckMultipleRoomsRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.RoomAvailabilityResponse;
import com.aurora.backend.entity.Room;
import com.aurora.backend.service.RoomAvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/room-availability")
@RequiredArgsConstructor
public class RoomAvailabilityController {

    private final RoomAvailabilityService roomAvailabilityService;

    @GetMapping("/check/{roomId}")
    public ApiResponse<Boolean> checkRoomAvailability(
            @PathVariable String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkinDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkoutDate
    ) {
        boolean available = roomAvailabilityService.isRoomAvailable(roomId, checkinDate, checkoutDate, null);
        return ApiResponse.<Boolean>builder()
                .result(available)
                .build();
    }

    @PostMapping("/check-multiple")
    public ApiResponse<Map<String, Boolean>> checkMultipleRooms(
            @Valid @RequestBody CheckMultipleRoomsRequest request
    ) {
        Map<String, Boolean> availability = roomAvailabilityService.checkMultipleRoomsAvailability(
                request.getRoomIds(), request.getCheckinDate(), request.getCheckoutDate()
        );
        return ApiResponse.<Map<String, Boolean>>builder()
                .result(availability)
                .build();
    }

    @GetMapping("/find-available")
    public ApiResponse<List<Room>> findAvailableRooms(
            @RequestParam String roomTypeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkinDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkoutDate,
            @RequestParam(required = false) String branchId
    ) {
        List<Room> availableRooms = roomAvailabilityService.findAvailableRooms(
                roomTypeId, checkinDate, checkoutDate, branchId
        );
        return ApiResponse.<List<Room>>builder()
                .result(availableRooms)
                .build();
    }

    @GetMapping("/calendar/{roomId}")
    public ApiResponse<RoomAvailabilityResponse> getAvailabilityCalendar(
            @PathVariable String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        RoomAvailabilityResponse calendar = roomAvailabilityService.getAvailabilityCalendar(
                roomId, startDate, endDate
        );
        return ApiResponse.<RoomAvailabilityResponse>builder()
                .result(calendar)
                .build();
    }

    @GetMapping("/count-available")
    public ApiResponse<Integer> countAvailableRooms(
            @RequestParam String roomTypeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkinDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkoutDate,
            @RequestParam(required = false) String branchId
    ) {
        int count = roomAvailabilityService.countAvailableRooms(
                roomTypeId, checkinDate, checkoutDate, branchId
        );
        return ApiResponse.<Integer>builder()
                .result(count)
                .build();
    }

    @GetMapping("/conflicts/{roomId}")
    public ApiResponse<List<String>> detectConflicts(
            @PathVariable String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkinDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkoutDate,
            @RequestParam(required = false) String excludeBookingId
    ) {
        List<String> conflicts = roomAvailabilityService.detectConflicts(
                roomId, checkinDate, checkoutDate, excludeBookingId
        );
        return ApiResponse.<List<String>>builder()
                .result(conflicts)
                .build();
    }

    @PostMapping("/lock")
    public ApiResponse<String> lockRoom(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkinDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkoutDate,
            @RequestParam String userId
    ) {
        String lockToken = roomAvailabilityService.lockRoom(roomId, checkinDate, checkoutDate, userId);
        return ApiResponse.<String>builder()
                .result(lockToken)
                .message("Room locked successfully for 15 minutes")
                .build();
    }

    @PostMapping("/unlock")
    public ApiResponse<Boolean> unlockRoom(@RequestParam String lockToken) {
        boolean released = roomAvailabilityService.releaseRoomLock(lockToken);
        return ApiResponse.<Boolean>builder()
                .result(released)
                .message(released ? "Room lock released successfully" : "Lock not found or already released")
                .build();
    }
}

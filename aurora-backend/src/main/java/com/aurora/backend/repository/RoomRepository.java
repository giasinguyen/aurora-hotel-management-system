package com.aurora.backend.repository;

import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Room;
import com.aurora.backend.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<Room> findByBranchId(String branchId);

    Page<Room> findByBranchId(String branchId, Pageable pageable);

    List<Room> findByRoomTypeId(String roomTypeId);

    Page<Room> findByRoomTypeId(String roomTypeId, Pageable pageable);

    Page<Room> findByStatus(String status, Pageable pageable);

    Page<Room> findByFloor(Integer floor, Pageable pageable);

    Page<Room> findByRoomNumberContainingIgnoreCase(String roomNumber, Pageable pageable);

    boolean existsByBranchIdAndRoomNumber(String branchId, String roomNumber);

    Page<Room> findByBranch(Branch branch, Pageable pageable);

    Page<Room> findByRoomType(RoomType roomType, Pageable pageable);

    boolean existsByBranchAndRoomNumber(Branch branch, String roomNumber);

    @Query("SELECT r FROM Room r WHERE " +
            "(:branch IS NULL OR r.branch = :branch) AND " +
            "(:roomType IS NULL OR r.roomType = :roomType) AND " +
            "(:status IS NULL OR :status = '' OR r.status = :status)")
    Page<Room> findByFilters(@Param("branch") Branch branch,
                             @Param("roomType") RoomType roomType,
                             @Param("status") String status,
                             Pageable pageable);


    @Query("SELECT DISTINCT r FROM Room r " +
            "WHERE r.branch.id = :branchId " +
            "AND r.status = 'READY' " +
            "AND r.id NOT IN (" +
            "    SELECT br.room.id FROM BookingRoom br " +
            "    WHERE br.booking.status IN ('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT') " +
            "    AND br.booking.checkout > :checkin " +
            "    AND br.booking.checkin < :checkout" +
            ")")
    List<Room> findAvailableRooms(
            @Param("branchId") String branchId,
            @Param("checkin") LocalDate checkin,
            @Param("checkout") LocalDate checkout
    );


    @Query("SELECT DISTINCT r FROM Room r " +
            "WHERE r.branch.id = :branchId " +
            "AND r.roomType.id = :roomTypeId " +
            "AND r.status = 'READY' " +
            "AND r.id NOT IN (" +
            "    SELECT br.room.id FROM BookingRoom br " +
            "    WHERE br.booking.status IN ('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT') " +
            "    AND br.booking.checkout > :checkin " +
            "    AND br.booking.checkin < :checkout" +
            ")")
    List<Room> findAvailableRoomsByType(
            @Param("branchId") String branchId,
            @Param("roomTypeId") String roomTypeId,
            @Param("checkin") LocalDate checkin,
            @Param("checkout") LocalDate checkout
    );


    @Query("SELECT CASE WHEN COUNT(br) > 0 THEN false ELSE true END " +
            "FROM BookingRoom br " +
            "WHERE br.room.id = :roomId " +
            "AND br.booking.status IN ('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT') " +
            "AND br.booking.checkout > :checkin " +
            "AND br.booking.checkin < :checkout")
    boolean isRoomAvailable(
            @Param("roomId") String roomId,
            @Param("checkin") LocalDate checkin,
            @Param("checkout") LocalDate checkout
    );


    @Query("SELECT COUNT(r) FROM Room r WHERE r.deleted = false " +
            "AND (:branchId IS NULL OR r.branch.id = :branchId)")
    long countActiveRooms(@Param("branchId") String branchId);

    @Query("SELECT r FROM Room r WHERE r.roomType.id = :roomTypeId AND r.branch.id = :branchId")
    List<Room> findByRoomTypeIdAndBranchId(
            @Param("roomTypeId") String roomTypeId,
            @Param("branchId") String branchId
    );
}


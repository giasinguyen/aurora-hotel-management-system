package com.aurora.backend.repository;

import com.aurora.backend.entity.Hotel;
import com.aurora.backend.entity.Room;
import com.aurora.backend.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    // Original methods with IDs
    List<Room> findByHotelId(String hotelId);
    Page<Room> findByHotelId(String hotelId, Pageable pageable);
    List<Room> findByRoomTypeId(String roomTypeId);
    Page<Room> findByRoomTypeId(String roomTypeId, Pageable pageable);
    Page<Room> findByStatus(String status, Pageable pageable);
    Page<Room> findByFloor(Integer floor, Pageable pageable);
    Page<Room> findByRoomNumberContainingIgnoreCase(String roomNumber, Pageable pageable);
    boolean existsByHotelIdAndRoomNumber(String hotelId, String roomNumber);
    
    // Additional methods with entities for service layer
    Page<Room> findByHotel(Hotel hotel, Pageable pageable);
    Page<Room> findByRoomType(RoomType roomType, Pageable pageable);
    boolean existsByHotelAndRoomNumber(Hotel hotel, String roomNumber);
    
    @Query("SELECT r FROM Room r WHERE " +
           "(:hotel IS NULL OR r.hotel = :hotel) AND " +
           "(:roomType IS NULL OR r.roomType = :roomType) AND " +
           "(:status IS NULL OR :status = '' OR r.status = :status)")
    Page<Room> findByFilters(@Param("hotel") Hotel hotel,
                           @Param("roomType") RoomType roomType,
                           @Param("status") String status,
                           Pageable pageable);
}

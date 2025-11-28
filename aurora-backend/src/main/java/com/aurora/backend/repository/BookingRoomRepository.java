package com.aurora.backend.repository;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.BookingRoom;
import com.aurora.backend.entity.Room;
import com.aurora.backend.repository.projection.TopRoomTypeProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;

@Repository
public interface BookingRoomRepository extends JpaRepository<BookingRoom, String> {
    Page<BookingRoom> findByBooking(Booking booking, Pageable pageable);
    Page<BookingRoom> findByRoom(Room room, Pageable pageable);
    boolean existsByBookingAndRoom(Booking booking, Room room);
    
    @Query("SELECT br FROM BookingRoom br WHERE " +
           "(:booking IS NULL OR br.booking = :booking) AND " +
           "(:room IS NULL OR br.room = :room)")
    Page<BookingRoom> findByFilters(@Param("booking") Booking booking,
                                   @Param("room") Room room,
                                   Pageable pageable);

    @Query("SELECT COUNT(DISTINCT br.room.id) FROM BookingRoom br " +
            "WHERE br.booking.status IN :statuses " +
            "AND br.booking.checkin <= :targetDate " +
            "AND br.booking.checkout > :targetDate " +
            "AND (:branchId IS NULL OR br.booking.branch.id = :branchId)")
    long countOccupiedRooms(@Param("branchId") String branchId,
                            @Param("targetDate") LocalDate targetDate,
                            @Param("statuses") Collection<Booking.BookingStatus> statuses);

    @Query("SELECT br.room.roomType.id AS roomTypeId, br.room.roomType.name AS roomTypeName, COUNT(br.id) AS bookingCount " +
            "FROM BookingRoom br " +
            "WHERE (:branchId IS NULL OR br.booking.branch.id = :branchId) " +
            "GROUP BY br.room.roomType.id, br.room.roomType.name " +
            "ORDER BY COUNT(br.id) DESC")
    Page<TopRoomTypeProjection> findTopRoomTypes(@Param("branchId") String branchId, Pageable pageable);
}

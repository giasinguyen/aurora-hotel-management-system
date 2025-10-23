package com.aurora.backend.repository;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.BookingRoom;
import com.aurora.backend.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}

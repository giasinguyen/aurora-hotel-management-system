package com.aurora.backend.service;

import com.aurora.backend.dto.request.BookingRoomCreationRequest;
import com.aurora.backend.dto.request.BookingRoomUpdateRequest;
import com.aurora.backend.dto.response.BookingRoomResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingRoomService {
    BookingRoomResponse createBookingRoom(BookingRoomCreationRequest request);
    BookingRoomResponse updateBookingRoom(String id, BookingRoomUpdateRequest request);
    void deleteBookingRoom(String id);
    BookingRoomResponse getBookingRoomById(String id);
    Page<BookingRoomResponse> getAllBookingRooms(Pageable pageable);
    Page<BookingRoomResponse> getBookingRoomsByBooking(String bookingId, Pageable pageable);
    Page<BookingRoomResponse> getBookingRoomsByRoom(String roomId, Pageable pageable);
    Page<BookingRoomResponse> searchBookingRooms(String bookingId, String roomId, Pageable pageable);
}

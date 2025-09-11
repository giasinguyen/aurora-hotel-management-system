package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.BookingRoomCreationRequest;
import com.aurora.backend.dto.request.BookingRoomUpdateRequest;
import com.aurora.backend.dto.response.BookingRoomResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.BookingRoom;
import com.aurora.backend.entity.Room;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.BookingRoomMapper;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.BookingRoomRepository;
import com.aurora.backend.repository.RoomRepository;
import com.aurora.backend.service.BookingRoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingRoomServiceImpl implements BookingRoomService {
    
    BookingRoomRepository bookingRoomRepository;
    BookingRepository bookingRepository;
    RoomRepository roomRepository;
    BookingRoomMapper bookingRoomMapper;

    @Override
    public BookingRoomResponse createBookingRoom(BookingRoomCreationRequest request) {
        // Check if booking exists
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        
        // Check if room exists
        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        
        // Check if booking-room combination already exists
        if (bookingRoomRepository.existsByBookingAndRoom(booking, room)) {
            throw new AppException(ErrorCode.BOOKING_ROOM_EXISTED);
        }
        
        BookingRoom bookingRoom = bookingRoomMapper.toBookingRoom(request);
        bookingRoom.setBooking(booking);
        bookingRoom.setRoom(room);
        
        BookingRoom savedBookingRoom = bookingRoomRepository.save(bookingRoom);
        
        return bookingRoomMapper.toBookingRoomResponse(savedBookingRoom);
    }

    @Override
    public Page<BookingRoomResponse> getAllBookingRooms(Pageable pageable) {
        Page<BookingRoom> bookingRoomPage = bookingRoomRepository.findAll(pageable);
        return bookingRoomPage.map(bookingRoomMapper::toBookingRoomResponse);
    }

    @Override
    public Page<BookingRoomResponse> getBookingRoomsByBooking(String bookingId, Pageable pageable) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        
        Page<BookingRoom> bookingRoomPage = bookingRoomRepository.findByBooking(booking, pageable);
        return bookingRoomPage.map(bookingRoomMapper::toBookingRoomResponse);
    }

    @Override
    public Page<BookingRoomResponse> getBookingRoomsByRoom(String roomId, Pageable pageable) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        
        Page<BookingRoom> bookingRoomPage = bookingRoomRepository.findByRoom(room, pageable);
        return bookingRoomPage.map(bookingRoomMapper::toBookingRoomResponse);
    }

    @Override
    public Page<BookingRoomResponse> searchBookingRooms(String bookingId, String roomId, Pageable pageable) {
        Booking booking = null;
        Room room = null;
        
        if (bookingId != null) {
            booking = bookingRepository.findById(bookingId)
                .orElse(null);
        }
        
        if (roomId != null) {
            room = roomRepository.findById(roomId)
                .orElse(null);
        }
        
        Page<BookingRoom> bookingRoomPage = bookingRoomRepository.findByFilters(booking, room, pageable);
        return bookingRoomPage.map(bookingRoomMapper::toBookingRoomResponse);
    }

    @Override
    public BookingRoomResponse getBookingRoomById(String id) {
        BookingRoom bookingRoom = bookingRoomRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.BOOKING_ROOM_NOT_EXISTED));
        
        return bookingRoomMapper.toBookingRoomResponse(bookingRoom);
    }

    @Override
    public BookingRoomResponse updateBookingRoom(String id, BookingRoomUpdateRequest request) {
        BookingRoom bookingRoom = bookingRoomRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.BOOKING_ROOM_NOT_EXISTED));
        
        bookingRoomMapper.updateBookingRoom(bookingRoom, request);
        BookingRoom updatedBookingRoom = bookingRoomRepository.save(bookingRoom);
        
        return bookingRoomMapper.toBookingRoomResponse(updatedBookingRoom);
    }

    @Override
    public void deleteBookingRoom(String id) {
        if (!bookingRoomRepository.existsById(id)) {
            throw new AppException(ErrorCode.BOOKING_ROOM_NOT_EXISTED);
        }
        
        bookingRoomRepository.deleteById(id);
    }
}

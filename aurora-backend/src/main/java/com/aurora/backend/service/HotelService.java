package com.aurora.backend.service;

import com.aurora.backend.dto.request.HotelCreationRequest;
import com.aurora.backend.dto.request.HotelUpdateRequest;
import com.aurora.backend.dto.response.HotelResponse;
import com.aurora.backend.entity.Hotel;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.HotelMapper;
import com.aurora.backend.repository.HotelRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class HotelService {
    HotelRepository hotelRepository;
    HotelMapper hotelMapper;

    public HotelResponse createHotel(HotelCreationRequest request) {
        log.info("Creating hotel with code: {}", request.getCode());
        
        if (hotelRepository.existsByCode(request.getCode()))
            throw new AppException(ErrorCode.HOTEL_EXISTED);

        Hotel hotel = hotelMapper.toHotel(request);
        Hotel savedHotel = hotelRepository.save(hotel);
        
        log.info("Hotel created successfully with ID: {}", savedHotel.getId());
        return hotelMapper.toHotelResponse(savedHotel);
    }

    public List<HotelResponse> getHotels() {
        log.info("Fetching all hotels");
        return hotelRepository.findAll().stream()
                .map(hotelMapper::toHotelResponse)
                .toList();
    }

    public Page<HotelResponse> getHotelsWithPagination(Pageable pageable) {
        log.info("Fetching hotels with pagination: page {}, size {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return hotelRepository.findAll(pageable)
                .map(hotelMapper::toHotelResponse);
    }

    public HotelResponse getHotel(String id) {
        log.info("Fetching hotel by ID: {}", id);
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_EXISTED));
        return hotelMapper.toHotelResponse(hotel);
    }

    public HotelResponse getHotelByCode(String code) {
        log.info("Fetching hotel by code: {}", code);
        Hotel hotel = hotelRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_EXISTED));
        return hotelMapper.toHotelResponse(hotel);
    }

    public HotelResponse updateHotel(String id, HotelUpdateRequest request) {
        log.info("Updating hotel with ID: {}", id);
        
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_EXISTED));

        hotelMapper.updateHotelFromRequest(request, hotel);
        Hotel updatedHotel = hotelRepository.save(hotel);
        
        log.info("Hotel updated successfully with ID: {}", updatedHotel.getId());
        return hotelMapper.toHotelResponse(updatedHotel);
    }

    public void deleteHotel(String id) {
        log.info("Deleting hotel with ID: {}", id);
        
        if (!hotelRepository.existsById(id)) {
            throw new AppException(ErrorCode.HOTEL_NOT_EXISTED);
        }
        
        hotelRepository.deleteById(id);
        log.info("Hotel deleted successfully with ID: {}", id);
    }

    public Page<HotelResponse> searchHotelsByName(String name, Pageable pageable) {
        log.info("Searching hotels by name: {} with pagination", name);
        return hotelRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(hotelMapper::toHotelResponse);
    }

    public Page<HotelResponse> searchHotelsByAddress(String address, Pageable pageable) {
        log.info("Searching hotels by address: {} with pagination", address);
        return hotelRepository.findByAddressContainingIgnoreCase(address, pageable)
                .map(hotelMapper::toHotelResponse);
    }
}

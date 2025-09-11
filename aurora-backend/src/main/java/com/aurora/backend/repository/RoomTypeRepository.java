package com.aurora.backend.repository;

import com.aurora.backend.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, String> {
    List<RoomType> findByHotelId(String hotelId);
    Page<RoomType> findByHotelId(String hotelId, Pageable pageable);
    Page<RoomType> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsByHotelIdAndName(String hotelId, String name);
    boolean existsByHotelIdAndCode(String hotelId, String code);
}

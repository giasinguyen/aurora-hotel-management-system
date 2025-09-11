package com.aurora.backend.repository;

import com.aurora.backend.entity.Facility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, String> {
    List<Facility> findByHotelId(String hotelId);
    Page<Facility> findByHotelId(String hotelId, Pageable pageable);
    Page<Facility> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsByHotelIdAndName(String hotelId, String name);
}

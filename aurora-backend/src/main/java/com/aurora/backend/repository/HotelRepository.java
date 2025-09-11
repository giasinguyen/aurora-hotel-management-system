package com.aurora.backend.repository;

import com.aurora.backend.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, String> {
    boolean existsByCode(String code);
    Optional<Hotel> findByCode(String code);
    Page<Hotel> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Hotel> findByAddressContainingIgnoreCase(String address, Pageable pageable);
}

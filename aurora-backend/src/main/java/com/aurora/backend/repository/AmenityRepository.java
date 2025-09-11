package com.aurora.backend.repository;

import com.aurora.backend.entity.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, String> {
    boolean existsByName(String name);
    Optional<Amenity> findByName(String name);
    Page<Amenity> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Amenity> findByType(String type, Pageable pageable);
}

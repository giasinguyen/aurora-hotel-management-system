package com.aurora.backend.repository;

import com.aurora.backend.entity.Hotel;
import com.aurora.backend.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    
    Page<Service> findByHotel(Hotel hotel, Pageable pageable);
    
    Page<Service> findByType(String type, Pageable pageable);
    
    Page<Service> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    boolean existsByHotelAndName(Hotel hotel, String name);
    
    @Query("SELECT s FROM Service s WHERE " +
           "(:hotel IS NULL OR s.hotel = :hotel) AND " +
           "(:type IS NULL OR :type = '' OR s.type = :type) AND " +
           "(:name IS NULL OR :name = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Service> findByFilters(@Param("hotel") Hotel hotel,
                              @Param("type") String type,
                              @Param("name") String name,
                              Pageable pageable);
}

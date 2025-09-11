package com.aurora.backend.repository;

import com.aurora.backend.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, String> {
    Optional<Promotion> findByCode(String code);
    boolean existsByCode(String code);
    Page<Promotion> findByActive(Boolean active, Pageable pageable);
    
    @Query("SELECT p FROM Promotion p WHERE " +
           "(:code IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%', :code, '%'))) AND " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:active IS NULL OR p.active = :active) AND " +
           "(:startDate IS NULL OR p.startAt >= :startDate) AND " +
           "(:endDate IS NULL OR p.endAt <= :endDate)")
    Page<Promotion> findByFilters(@Param("code") String code,
                                 @Param("name") String name,
                                 @Param("active") Boolean active,
                                 @Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate,
                                 Pageable pageable);
}

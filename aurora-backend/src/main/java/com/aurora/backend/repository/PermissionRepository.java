package com.aurora.backend.repository;

import com.aurora.backend.entity.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {
    boolean existsByCode(String code);
    Page<Permission> findByCodeContainingIgnoreCase(String code, Pageable pageable);
    Page<Permission> findByDescriptionContainingIgnoreCase(String description, Pageable pageable);
    
    @Query("SELECT p FROM Permission p WHERE " +
           "(:code IS NULL OR :code = '' OR LOWER(p.code) LIKE LOWER(CONCAT('%', :code, '%'))) AND " +
           "(:description IS NULL OR :description = '' OR LOWER(p.description) LIKE LOWER(CONCAT('%', :description, '%')))")
    Page<Permission> findByFilters(@Param("code") String code,
                                  @Param("description") String description,
                                  Pageable pageable);
}

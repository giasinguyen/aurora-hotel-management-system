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
    boolean existsByName(String name);
    Page<Permission> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Permission> findByDescriptionContainingIgnoreCase(String description, Pageable pageable);
    
    @Query("SELECT p FROM Permission p WHERE " +
           "(:name IS NULL OR :name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:description IS NULL OR :description = '' OR LOWER(p.description) LIKE LOWER(CONCAT('%', :description, '%')))")
    Page<Permission> findByFilters(@Param("name") String name,
                                  @Param("description") String description,
                                  Pageable pageable);
}

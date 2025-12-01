package com.aurora.backend.repository;

import com.aurora.backend.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, String> {
    List<RoomType> findByBranchId(String BranchId);
    Page<RoomType> findByBranchId(String BranchId, Pageable pageable);
    Page<RoomType> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsByBranchIdAndName(String BranchId, String name);
    boolean existsByBranchIdAndCode(String BranchId, String code);
    
    /**
     * Tìm room types theo category
     */
    @Query("SELECT rt FROM RoomType rt WHERE rt.category.id = :categoryId AND rt.deleted = false")
    List<RoomType> findByCategoryId(@Param("categoryId") String categoryId);
    
    /**
     * Tìm room types theo branch và category
     */
    @Query("SELECT rt FROM RoomType rt WHERE rt.branch.id = :branchId AND rt.category.id = :categoryId AND rt.deleted = false")
    List<RoomType> findByBranchIdAndCategoryId(@Param("branchId") String branchId, @Param("categoryId") String categoryId);
}

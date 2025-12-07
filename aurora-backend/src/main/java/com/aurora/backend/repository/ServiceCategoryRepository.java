package com.aurora.backend.repository;

import com.aurora.backend.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, String> {
    
    /**
     * Tìm tất cả categories của một branch, sắp xếp theo displayOrder
     */
    @Query("SELECT sc FROM ServiceCategory sc WHERE sc.branch.id = :branchId AND sc.active = true AND sc.deleted = false ORDER BY sc.displayOrder ASC")
    List<ServiceCategory> findByBranchIdAndActiveTrue(@Param("branchId") String branchId);
    
    /**
     * Tìm category theo code và branch
     */
    @Query("SELECT sc FROM ServiceCategory sc WHERE sc.code = :code AND sc.branch.id = :branchId AND sc.deleted = false")
    Optional<ServiceCategory> findByCodeAndBranchId(@Param("code") String code, @Param("branchId") String branchId);
    
    /**
     * Tìm category theo ID và branch
     */
    @Query("SELECT sc FROM ServiceCategory sc WHERE sc.id = :id AND sc.branch.id = :branchId AND sc.deleted = false")
    Optional<ServiceCategory> findByIdAndBranchId(@Param("id") String id, @Param("branchId") String branchId);
    
    /**
     * Kiểm tra xem code đã tồn tại trong branch chưa
     */
    @Query("SELECT COUNT(sc) > 0 FROM ServiceCategory sc WHERE sc.code = :code AND sc.branch.id = :branchId AND sc.deleted = false")
    boolean existsByCodeAndBranchId(@Param("code") String code, @Param("branchId") String branchId);
    
    /**
     * Tìm tất cả categories (không phân biệt branch), sắp xếp theo displayOrder
     */
    @Query("SELECT sc FROM ServiceCategory sc WHERE sc.active = true AND sc.deleted = false ORDER BY sc.displayOrder ASC")
    List<ServiceCategory> findAllActive();
}


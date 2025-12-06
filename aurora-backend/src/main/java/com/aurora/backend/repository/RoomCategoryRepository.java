package com.aurora.backend.repository;

import com.aurora.backend.entity.RoomCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomCategoryRepository extends JpaRepository<RoomCategory, String> {
    
    /**
     * Tìm tất cả categories của một branch, sắp xếp theo displayOrder
     */
    @Query("SELECT rc FROM RoomCategory rc WHERE rc.branch.id = :branchId AND rc.active = true AND rc.deleted = false ORDER BY rc.displayOrder ASC")
    List<RoomCategory> findByBranchIdAndActiveTrue(@Param("branchId") String branchId);
    
    /**
     * Tìm category theo code và branch
     */
    @Query("SELECT rc FROM RoomCategory rc WHERE rc.code = :code AND rc.branch.id = :branchId AND rc.deleted = false")
    Optional<RoomCategory> findByCodeAndBranchId(@Param("code") String code, @Param("branchId") String branchId);
    
    /**
     * Tìm category theo ID và branch
     */
    @Query("SELECT rc FROM RoomCategory rc WHERE rc.id = :id AND rc.branch.id = :branchId AND rc.deleted = false")
    Optional<RoomCategory> findByIdAndBranchId(@Param("id") String id, @Param("branchId") String branchId);
    
    /**
     * Kiểm tra xem code đã tồn tại trong branch chưa
     */
    @Query("SELECT COUNT(rc) > 0 FROM RoomCategory rc WHERE rc.code = :code AND rc.branch.id = :branchId AND rc.deleted = false")
    boolean existsByCodeAndBranchId(@Param("code") String code, @Param("branchId") String branchId);
}


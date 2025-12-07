package com.aurora.backend.repository;

import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Service;
import com.aurora.backend.entity.ServiceCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    
    Page<Service> findByBranch(Branch branch, Pageable pageable);
    
    Page<Service> findByCategory(ServiceCategory category, Pageable pageable);
    
    Page<Service> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    boolean existsByBranchAndName(Branch branch, String name);
    
    @Query("SELECT s FROM Service s WHERE " +
           "(:branch IS NULL OR s.branch = :branch) AND " +
           "(:categoryId IS NULL OR :categoryId = '' OR s.category.id = :categoryId) AND " +
           "(:name IS NULL OR :name = '' OR CAST(s.name AS string) LIKE CONCAT('%', CAST(:name AS string), '%'))")
    Page<Service> findByFilters(@Param("branch") Branch branch,
                              @Param("categoryId") String categoryId,
                              @Param("name") String name,
                              Pageable pageable);
}

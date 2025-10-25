package com.aurora.backend.repository;

import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    
    Page<Service> findByBranch(Branch branch, Pageable pageable);
    
    Page<Service> findByType(String type, Pageable pageable);
    
    Page<Service> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    boolean existsByBranchAndName(Branch branch, String name);
    
    @Query("SELECT s FROM Service s WHERE " +
           "(:branch IS NULL OR s.branch = :branch) AND " +
           "(:type IS NULL OR :type = '' OR s.type = :type) AND " +
           "(:name IS NULL OR :name = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Service> findByFilters(@Param("branch") Branch branch,
                              @Param("type") String type,
                              @Param("name") String name,
                              Pageable pageable);
}

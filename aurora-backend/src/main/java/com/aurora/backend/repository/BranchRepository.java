package com.aurora.backend.repository;

import com.aurora.backend.entity.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, String> {
    Optional<Branch> findByCode(String code);
    
    boolean existsByCode(String code);
    
    Page<Branch> findByStatus(Branch.BranchStatus status, Pageable pageable);
    
    Page<Branch> findByCity(String city, Pageable pageable);
    
    Page<Branch> findByManagerId(String managerId, Pageable pageable);
    
    @Query("SELECT b FROM Branch b WHERE " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.code) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Branch> searchBranches(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT b FROM Branch b WHERE b.status = :status AND " +
           "(LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.city) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Branch> searchByStatusAndKeyword(@Param("status") Branch.BranchStatus status, 
                                           @Param("keyword") String keyword, 
                                           Pageable pageable);
}

package com.aurora.backend.repository;

import com.aurora.backend.entity.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, String> {
    Optional<Branch> findByCode(String code);
    
    boolean existsByCode(String code);
    
    Page<Branch> findByStatus(Branch.BranchStatus status, Pageable pageable);
    
    List<Branch> findAllByStatus(Branch.BranchStatus status);
    
    Page<Branch> findByCity(String city, Pageable pageable);
    
    Page<Branch> findByManagerId(String managerId, Pageable pageable);
    
    @Query("SELECT b FROM Branch b WHERE " +
           "CAST(b.name AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') OR " +
           "CAST(b.code AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') OR " +
           "CAST(b.city AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') OR " +
           "CAST(b.address AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%')")
    Page<Branch> searchBranches(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT b FROM Branch b WHERE b.status = :status AND " +
           "(CAST(b.name AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') OR " +
           "CAST(b.city AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%'))")
    Page<Branch> searchByStatusAndKeyword(@Param("status") Branch.BranchStatus status, 
                                           @Param("keyword") String keyword, 
                                           Pageable pageable);
}

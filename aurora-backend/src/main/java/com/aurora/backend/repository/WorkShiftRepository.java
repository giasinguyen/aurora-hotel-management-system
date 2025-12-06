package com.aurora.backend.repository;

import com.aurora.backend.entity.WorkShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkShiftRepository extends JpaRepository<WorkShift, String> {

    List<WorkShift> findByActiveTrue();

    @Query("SELECT ws FROM WorkShift ws WHERE ws.active = true " +
            "AND (ws.branch.id = :branchId OR ws.branch IS NULL)")
    List<WorkShift> findActiveShiftsByBranch(@Param("branchId") String branchId);

    Optional<WorkShift> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT ws FROM WorkShift ws WHERE ws.branch.id = :branchId OR ws.branch IS NULL " +
            "ORDER BY ws.startTime")
    List<WorkShift> findByBranchOrGlobal(@Param("branchId") String branchId);

    boolean existsByNameAndBranchId(String name, String branchId);

    boolean existsByNameAndBranchIsNull(String name);

    @Query("SELECT ws FROM WorkShift ws WHERE ws.active = true ORDER BY ws.startTime")
    List<WorkShift> findAllActiveShifts();
}

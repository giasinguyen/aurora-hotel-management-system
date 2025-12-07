package com.aurora.backend.repository;

import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.StaffShiftAssignment;
import com.aurora.backend.entity.User;
import com.aurora.backend.enums.ShiftAssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffShiftAssignmentRepository extends JpaRepository<StaffShiftAssignment, String> {

    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.staff.id = :staffId " +
            "AND ssa.shiftDate = :date " +
            "ORDER BY ssa.workShift.startTime")
    List<StaffShiftAssignment> findByStaffIdAndDate(@Param("staffId") String staffId,
                                                    @Param("date") LocalDate date);

    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.staff.id = :staffId " +
            "AND ssa.shiftDate = :date " +
            "AND ssa.status = :status " +
            "ORDER BY ssa.workShift.startTime")
    List<StaffShiftAssignment> findByStaffIdAndDateAndStatus(@Param("staffId") String staffId,
                                                             @Param("date") LocalDate date,
                                                             @Param("status") ShiftAssignmentStatus status);

    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.staff.id = :staffId " +
            "AND ssa.shiftDate BETWEEN :startDate AND :endDate " +
            "ORDER BY ssa.shiftDate, ssa.workShift.startTime")
    List<StaffShiftAssignment> findByStaffIdAndDateRange(@Param("staffId") String staffId,
                                                         @Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate);

    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "JOIN FETCH ssa.staff " +
            "JOIN FETCH ssa.workShift " +
            "WHERE ssa.shiftDate = :date " +
            "AND (:branchId IS NULL OR ssa.branch.id = :branchId) " +
            "ORDER BY ssa.workShift.startTime, ssa.staff.username")
    List<StaffShiftAssignment> findByDateAndBranch(@Param("date") LocalDate date,
                                                   @Param("branchId") String branchId);

    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.shiftDate BETWEEN :startDate AND :endDate " +
            "AND (:branchId IS NULL OR ssa.branch.id = :branchId) " +
            "ORDER BY ssa.shiftDate, ssa.workShift.startTime")
    List<StaffShiftAssignment> findByDateRangeAndBranch(@Param("startDate") LocalDate startDate,
                                                        @Param("endDate") LocalDate endDate,
                                                        @Param("branchId") String branchId);

    boolean existsByStaff_IdAndShiftDateAndWorkShift_Id(String staffId, LocalDate shiftDate, String workShiftId);

    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.staff = :user " +
            "AND ssa.shiftDate = :shiftDate " +
            "ORDER BY ssa.workShift.startTime")
    List<StaffShiftAssignment> findByUserAndShiftDate(@Param("user") User user,
                                                      @Param("shiftDate") LocalDate shiftDate);


    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.staff = :user " +
            "AND ssa.shiftDate BETWEEN :startDate AND :endDate " +
            "ORDER BY ssa.shiftDate, ssa.workShift.startTime")
    List<StaffShiftAssignment> findByUserAndShiftDateBetween(@Param("user") User user,
                                                             @Param("startDate") LocalDate startDate,
                                                             @Param("endDate") LocalDate endDate);


    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.shiftDate = :shiftDate " +
            "AND ssa.branch = :branch " +
            "ORDER BY ssa.workShift.startTime, ssa.staff.username")
    List<StaffShiftAssignment> findByShiftDateAndBranch(@Param("shiftDate") LocalDate shiftDate,
                                                        @Param("branch") Branch branch);


    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.shiftDate = :shiftDate " +
            "ORDER BY ssa.workShift.startTime, ssa.staff.username")
    List<StaffShiftAssignment> findByShiftDate(@Param("shiftDate") LocalDate shiftDate);


    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.shiftDate BETWEEN :startDate AND :endDate " +
            "AND ssa.branch = :branch " +
            "ORDER BY ssa.shiftDate, ssa.workShift.startTime")
    List<StaffShiftAssignment> findByShiftDateBetweenAndBranch(@Param("startDate") LocalDate startDate,
                                                               @Param("endDate") LocalDate endDate,
                                                               @Param("branch") Branch branch);


    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "WHERE ssa.shiftDate BETWEEN :startDate AND :endDate " +
            "ORDER BY ssa.shiftDate, ssa.workShift.startTime")
    List<StaffShiftAssignment> findByShiftDateBetween(@Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate);

    /**
     * Find all shift assignments in date range with optional filters
     * Used for dashboard shift reports
     */
    @Query("SELECT ssa FROM StaffShiftAssignment ssa " +
            "JOIN FETCH ssa.staff " +
            "JOIN FETCH ssa.workShift " +
            "WHERE ssa.shiftDate BETWEEN :startDate AND :endDate " +
            "AND (:branchId IS NULL OR ssa.branch.id = :branchId) " +
            "AND (:staffId IS NULL OR ssa.staff.id = :staffId) " +
            "ORDER BY ssa.shiftDate DESC, ssa.workShift.startTime")
    List<StaffShiftAssignment> findAllInRange(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate,
                                              @Param("branchId") String branchId,
                                              @Param("staffId") String staffId);
}

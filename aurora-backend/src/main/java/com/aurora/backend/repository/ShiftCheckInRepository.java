package com.aurora.backend.repository;

import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.ShiftCheckIn;
import com.aurora.backend.entity.StaffShiftAssignment;
import com.aurora.backend.entity.User;
import com.aurora.backend.enums.CheckInStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftCheckInRepository extends JpaRepository<ShiftCheckIn, String> {
    Optional<ShiftCheckIn> findByAssignmentId(String assignmentId);

    @Query("SELECT sci FROM ShiftCheckIn sci " +
            "WHERE sci.staff.id = :staffId " +
            "AND DATE(sci.checkInTime) BETWEEN :startDate AND :endDate " +
            "ORDER BY sci.checkInTime DESC")
    List<ShiftCheckIn> findByStaffIdAndDateRange(@Param("staffId") String staffId,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    @Query("SELECT sci FROM ShiftCheckIn sci " +
            "WHERE sci.staff.id = :staffId " +
            "AND sci.checkOutTime IS NULL " +
            "AND sci.status = 'CHECKED_IN'")
    Optional<ShiftCheckIn> findCurrentActiveCheckIn(@Param("staffId") String staffId);

    @Query("SELECT sci FROM ShiftCheckIn sci " +
            "JOIN FETCH sci.staff " +
            "JOIN FETCH sci.assignment " +
            "WHERE DATE(sci.checkInTime) = :date " +
            "ORDER BY sci.checkInTime")
    List<ShiftCheckIn> findByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(sci) FROM ShiftCheckIn sci " +
            "WHERE sci.staff.id = :staffId " +
            "AND sci.isLate = true " +
            "AND DATE(sci.checkInTime) BETWEEN :startDate AND :endDate")
    Long countLateCheckIns(@Param("staffId") String staffId,
                           @Param("startDate") LocalDate startDate,
                           @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM((EXTRACT(EPOCH FROM sci.checkOutTime) - EXTRACT(EPOCH FROM sci.checkInTime))/3600) " +
            "FROM ShiftCheckIn sci " +
            "WHERE sci.staff.id = :staffId " +
            "AND sci.checkOutTime IS NOT NULL " +
            "AND DATE(sci.checkInTime) BETWEEN :startDate AND :endDate")
    Double calculateTotalWorkingHours(@Param("staffId") String staffId,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);

    Optional<ShiftCheckIn> findByAssignmentAndCheckOutTimeIsNull(StaffShiftAssignment assignment);

    List<ShiftCheckIn> findByAssignment(StaffShiftAssignment assignment);

    @Query("SELECT sci FROM ShiftCheckIn sci " +
            "WHERE sci.staff = :staff " +
            "AND DATE(sci.checkInTime) BETWEEN :startDate AND :endDate " +
            "ORDER BY sci.checkInTime")
    List<ShiftCheckIn> findByStaffInDateRange(@Param("staff") User staff,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT sci FROM ShiftCheckIn sci " +
            "WHERE sci.assignment.branch = :branch " +
            "AND DATE(sci.checkInTime) BETWEEN :startDate AND :endDate " +
            "ORDER BY sci.checkInTime")
    List<ShiftCheckIn> findByBranchInDateRange(@Param("branch") Branch branch,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    @Query("SELECT sci FROM ShiftCheckIn sci " +
            "WHERE sci.staff = :user " +
            "AND DATE(sci.checkInTime) = :date " +
            "AND sci.checkOutTime IS NULL " +
            "ORDER BY sci.checkInTime DESC")
    Optional<ShiftCheckIn> findCurrentCheckIn(@Param("user") User user, @Param("date") LocalDate date);


    @Query("SELECT COALESCE(SUM((EXTRACT(EPOCH FROM sci.checkOutTime) - EXTRACT(EPOCH FROM sci.checkInTime))/3600), 0.0) " +
            "FROM ShiftCheckIn sci " +
            "WHERE sci.staff = :user " +
            "AND DATE(sci.checkInTime) BETWEEN :startDate AND :endDate " +
            "AND sci.checkOutTime IS NOT NULL")
    Double getTotalWorkingHours(@Param("user") User user,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate);

    @Query("SELECT sci FROM ShiftCheckIn sci " +
            "WHERE sci.isLate = true " +
            "AND DATE(sci.checkInTime) BETWEEN :startDate AND :endDate " +
            "AND (:branch IS NULL OR sci.assignment.branch = :branch) " +
            "ORDER BY sci.checkInTime")
    List<ShiftCheckIn> findLateCheckIns(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate,
                                        @Param("branch") Branch branch);
}

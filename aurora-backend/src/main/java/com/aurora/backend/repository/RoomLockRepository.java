package com.aurora.backend.repository;

import com.aurora.backend.entity.RoomLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomLockRepository extends JpaRepository<RoomLock, Long> {


    @Query("SELECT rl FROM RoomLock rl WHERE rl.lockToken = :token AND rl.released = false")
    Optional<RoomLock> findByLockToken(@Param("token") String token);

    @Query("SELECT rl FROM RoomLock rl WHERE rl.room.id = :roomId " +
            "AND rl.released = false " +
            "AND rl.expiresAt > :now " +
            "AND rl.checkinDate < :checkoutDate " +
            "AND rl.checkoutDate > :checkinDate")
    List<RoomLock> findActiveLocksForRoom(
            @Param("roomId") String roomId,
            @Param("checkinDate") LocalDate checkinDate,
            @Param("checkoutDate") LocalDate checkoutDate,
            @Param("now") LocalDateTime now
    );

    @Query("SELECT rl FROM RoomLock rl WHERE rl.released = false AND rl.expiresAt < :now")
    List<RoomLock> findExpiredLocks(@Param("now") LocalDateTime now);


    @Modifying
    @Query("UPDATE RoomLock rl SET rl.released = true, rl.releasedAt = :now " +
            "WHERE rl.released = false AND rl.expiresAt < :now")
    int releaseExpiredLocks(@Param("now") LocalDateTime now);


    @Modifying
    @Query("DELETE FROM RoomLock rl WHERE rl.released = true AND rl.releasedAt < :cutoffDate")
    int deleteOldReleasedLocks(@Param("cutoffDate") LocalDateTime cutoffDate);
}

package com.aurora.backend.repository;

import com.aurora.backend.entity.EmailVerificationToken;
import com.aurora.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    
    Optional<EmailVerificationToken> findByToken(String token);
    
    Optional<EmailVerificationToken> findByUserAndVerifiedFalseAndExpiryDateAfter(User user, LocalDateTime now);
    
    @Modifying
    @Query("UPDATE EmailVerificationToken t SET t.verified = true WHERE t.user = :user AND t.verified = false")
    void invalidateAllUserTokens(@Param("user") User user);
    
    @Modifying
    @Query("DELETE FROM EmailVerificationToken t WHERE t.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
}

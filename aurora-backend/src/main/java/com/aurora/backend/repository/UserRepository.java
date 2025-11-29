package com.aurora.backend.repository;

import com.aurora.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);

    // Method mới: Eager fetch roles và permissions trong 1 query duy nhất
    // Dùng cho JWT Authentication để tránh LazyInitializationException
    @Query("""
        SELECT DISTINCT u FROM User u
        LEFT JOIN FETCH u.roles r
        LEFT JOIN FETCH r.permissions
        WHERE u.username = :username
    """)
    Optional<User> findByUsernameWithPermissions(@Param("username") String username);
    Optional<User> findByEmail(String email);

    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findAllByRoleName(@Param("roleName") String roleName);

    @Query(value = """
    SELECT period_label, COUNT(*) as customers
    FROM (
        SELECT TO_CHAR(u.created_at, :format) as period_label
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE r.name = 'CUSTOMER'
    ) subquery
    GROUP BY period_label
    ORDER BY period_label
    """, nativeQuery = true)
    List<Object[]> countCustomersByPeriodNative(@Param("format") String format);
}
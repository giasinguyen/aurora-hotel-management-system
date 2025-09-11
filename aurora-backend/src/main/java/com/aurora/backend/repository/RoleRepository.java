package com.aurora.backend.repository;

import com.aurora.backend.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    boolean existsByName(String name);
    Page<Role> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

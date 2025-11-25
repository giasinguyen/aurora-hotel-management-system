package com.aurora.backend.repository;

import com.aurora.backend.entity.DocumentContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentContentRepository extends JpaRepository<DocumentContent, Long> {
}
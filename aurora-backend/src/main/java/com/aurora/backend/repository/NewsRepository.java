package com.aurora.backend.repository;

import com.aurora.backend.entity.News;
import com.aurora.backend.enums.NewsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, String> {
    Optional<News> findBySlug(String slug);
    
    List<News> findByIsPublicTrueAndStatus(NewsStatus status);
    
    Optional<News> findBySlugAndIsPublicTrueAndStatus(String slug, NewsStatus status);
    
    boolean existsBySlug(String slug);
}

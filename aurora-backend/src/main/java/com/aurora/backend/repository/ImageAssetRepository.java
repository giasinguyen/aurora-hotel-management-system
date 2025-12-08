package com.aurora.backend.repository;

import com.aurora.backend.entity.ImageAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageAssetRepository extends JpaRepository<ImageAsset, String> {
    List<ImageAsset> findByNewsId(String newsId);
    
    Optional<ImageAsset> findByPublicId(String publicId);
    
    @Modifying
    @Query("DELETE FROM ImageAsset i WHERE i.news.id = :newsId")
    void deleteByNewsId(@Param("newsId") String newsId);
}

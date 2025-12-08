package com.aurora.backend.entity;

import com.aurora.backend.enums.NewsStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "news")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class News extends BaseEntity {

    @Column(unique = true, nullable = false)
    String slug;

    @Column(nullable = false)
    String title;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(name = "thumbnail_url")
    String thumbnailUrl;

    @Column(name = "is_public")
    @Builder.Default
    Boolean isPublic = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_json", nullable = false, columnDefinition = "jsonb")
    Map<String, Object> contentJson;

    @Column(name = "content_html", columnDefinition = "TEXT")
    String contentHtml;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    NewsStatus status;

    @Column(name = "published_at")
    LocalDateTime publishedAt;

    @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<ImageAsset> images = new ArrayList<>();

    // Helper methods
    public void addImage(ImageAsset image) {
        images.add(image);
        image.setNews(this);
    }

    public void removeImage(ImageAsset image) {
        images.remove(image);
        image.setNews(null);
    }
}
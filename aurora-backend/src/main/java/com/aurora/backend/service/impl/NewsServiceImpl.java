package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.NewsCreationRequest;
import com.aurora.backend.dto.request.NewsUpdateRequest;
import com.aurora.backend.dto.request.NewsVisibilityRequest;
import com.aurora.backend.dto.response.NewsListResponse;
import com.aurora.backend.dto.response.NewsResponse;
import com.aurora.backend.entity.News;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.enums.NewsStatus;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.NewsMapper;
import com.aurora.backend.repository.NewsRepository;
import com.aurora.backend.service.CloudinaryService;
import com.aurora.backend.service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public List<NewsListResponse> getPublicNews() {
        log.info("Getting all public news");

        List<News> newsList = newsRepository.findByIsPublicTrueAndStatus(NewsStatus.PUBLISHED);

        return newsList.stream()
                .map(newsMapper::toNewsListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NewsResponse getPublicNewsBySlug(String slug) {
        log.info("Getting public news by slug: {}", slug);

        News news = newsRepository.findBySlugAndIsPublicTrueAndStatus(slug, NewsStatus.PUBLISHED)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));

        return newsMapper.toNewsResponse(news);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsListResponse> getAllNews() {
        log.info("Getting all news (admin)");

        List<News> newsList = newsRepository.findAll();

        return newsList.stream()
                .map(newsMapper::toNewsListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NewsResponse getNewsBySlug(String slug) {
        log.info("Getting news by slug (admin): {}", slug);

        News news = newsRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));

        return newsMapper.toNewsResponse(news);
    }

    @Override
    @Transactional
    public NewsResponse createNews(NewsCreationRequest request, MultipartFile thumbnail) {
        log.info("Creating news: title={}, slug={}, id={}, hasThumbnail={}", 
                request.getTitle(), request.getSlug(), request.getId(), thumbnail != null);

        News news;
        
        // Upload thumbnail if provided
        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                String folder = "news/thumbnails";
                Map<String, Object> uploadResult = cloudinaryService.uploadFile(thumbnail, folder);
                String thumbnailUrl = (String) uploadResult.get("secure_url");
                request.setThumbnailUrl(thumbnailUrl);
                log.info("Thumbnail uploaded successfully: {}", thumbnailUrl);
            } catch (IOException e) {
                log.error("Failed to upload thumbnail", e);
                throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
            }
        }
        
        // If ID is provided, update existing news instead of creating new one
        if (request.getId() != null && !request.getId().isEmpty()) {
            news = newsRepository.findById(request.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));
            
            // Check slug uniqueness if slug is being changed
            if (!request.getSlug().equals(news.getSlug()) && newsRepository.existsBySlug(request.getSlug())) {
                throw new AppException(ErrorCode.NEWS_SLUG_EXISTED);
            }
            
            // Update existing news
            news.setTitle(request.getTitle());
            news.setSlug(request.getSlug());
            news.setDescription(request.getDescription());
            if (request.getThumbnailUrl() != null) {
                news.setThumbnailUrl(request.getThumbnailUrl());
            }
            news.setContentJson(request.getContentJson());
            news.setContentHtml(request.getContentHtml());
            if (request.getIsPublic() != null) {
                news.setIsPublic(request.getIsPublic());
            }
            
            log.info("Updating existing news with id={}", request.getId());
        } else {
            // Check if slug already exists
            if (newsRepository.existsBySlug(request.getSlug())) {
                throw new AppException(ErrorCode.NEWS_SLUG_EXISTED);
            }

            news = newsMapper.toNews(request);
            news.setStatus(NewsStatus.DRAFT);
            
            log.info("Creating new news");
        }
        
        // Set publishedAt if isPublic is true
        if (Boolean.TRUE.equals(news.getIsPublic())) {
            if (news.getPublishedAt() == null) {
                news.setPublishedAt(LocalDateTime.now());
            }
            news.setStatus(NewsStatus.PUBLISHED);
        }

        news = newsRepository.save(news);
        log.info("News saved successfully: id={}, slug={}", news.getId(), news.getSlug());

        return newsMapper.toNewsResponse(news);
    }

    @Override
    @Transactional
    public NewsResponse updateNews(String id, NewsUpdateRequest request, MultipartFile thumbnail) {
        log.info("Updating news: id={}, hasThumbnail={}", id, thumbnail != null);

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));

        // Upload thumbnail if provided
        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                String folder = "news/thumbnails";
                Map<String, Object> uploadResult = cloudinaryService.uploadFile(thumbnail, folder);
                String thumbnailUrl = (String) uploadResult.get("secure_url");
                request.setThumbnailUrl(thumbnailUrl);
                log.info("Thumbnail uploaded successfully: {}", thumbnailUrl);
            } catch (IOException e) {
                log.error("Failed to upload thumbnail", e);
                throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
            }
        }

        // Check slug uniqueness if slug is being updated
        if (request.getSlug() != null && !request.getSlug().equals(news.getSlug())) {
            if (newsRepository.existsBySlug(request.getSlug())) {
                throw new AppException(ErrorCode.NEWS_SLUG_EXISTED);
            }
        }

        newsMapper.updateNewsFromRequest(request, news);
        
        // Update publishedAt if isPublic is being set to true and not yet published
        if (request.getIsPublic() != null && request.getIsPublic()
                && news.getPublishedAt() == null) {
            news.setPublishedAt(LocalDateTime.now());
            news.setStatus(NewsStatus.PUBLISHED);
        }

        news = newsRepository.save(news);
        log.info("News updated successfully: id={}", id);

        return newsMapper.toNewsResponse(news);
    }

    @Override
    @Transactional
    public NewsResponse updateNewsVisibility(String id, NewsVisibilityRequest request) {
        log.info("Updating news visibility: id={}, isPublic={}", id, request.getIsPublic());

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));

        news.setIsPublic(request.getIsPublic());

        // Update status and publishedAt based on visibility
        if (Boolean.TRUE.equals(request.getIsPublic())) {
            if (news.getPublishedAt() == null) {
                news.setPublishedAt(LocalDateTime.now());
            }
            news.setStatus(NewsStatus.PUBLISHED);
        } else {
            news.setStatus(NewsStatus.DRAFT);
        }

        news = newsRepository.save(news);
        log.info("News visibility updated successfully: id={}, isPublic={}", id, request.getIsPublic());

        return newsMapper.toNewsResponse(news);
    }

    @Override
    @Transactional
    public void deleteNews(String id) {
        log.info("Deleting news: id={}", id);

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));

        newsRepository.delete(news);
        log.info("News deleted successfully: id={}", id);
    }
}

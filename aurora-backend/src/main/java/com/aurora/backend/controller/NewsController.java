package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.NewsCreationRequest;
import com.aurora.backend.dto.request.NewsUpdateRequest;
import com.aurora.backend.dto.request.NewsVisibilityRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.ImageAssetResponse;
import com.aurora.backend.dto.response.NewsListResponse;
import com.aurora.backend.dto.response.NewsResponse;
import com.aurora.backend.service.ImageAssetService;
import com.aurora.backend.service.NewsService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NewsController {

    NewsService newsService;
    ImageAssetService imageAssetService;

    // Public endpoints
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<NewsListResponse>>> getPublicNews() {
        log.info("Request to get all public news");

        List<NewsListResponse> newsList = newsService.getPublicNews();

        return ResponseEntity.ok(
                ApiResponse.<List<NewsListResponse>>builder()
                        .message("Public news retrieved successfully")
                        .result(newsList)
                        .build()
        );
    }

    @GetMapping("/public/{slug}")
    public ResponseEntity<ApiResponse<NewsResponse>> getPublicNewsBySlug(@PathVariable String slug) {
        log.info("Request to get public news by slug: {}", slug);

        NewsResponse news = newsService.getPublicNewsBySlug(slug);

        return ResponseEntity.ok(
                ApiResponse.<NewsResponse>builder()
                        .message("News retrieved successfully")
                        .result(news)
                        .build()
        );
    }

    // Admin endpoints
    @GetMapping
    @RequirePermission(PermissionConstants.Admin.NEWS_VIEW_ALL)
    public ResponseEntity<ApiResponse<List<NewsListResponse>>> getAllNews() {
        log.info("Request to get all news (admin)");

        List<NewsListResponse> newsList = newsService.getAllNews();

        return ResponseEntity.ok(
                ApiResponse.<List<NewsListResponse>>builder()
                        .message("All news retrieved successfully")
                        .result(newsList)
                        .build()
        );
    }

    @GetMapping("/{slug}")
    @RequirePermission(PermissionConstants.Admin.NEWS_VIEW_ALL)
    public ResponseEntity<ApiResponse<NewsResponse>> getNewsBySlug(@PathVariable String slug) {
        log.info("Request to get news by slug (admin): {}", slug);

        NewsResponse news = newsService.getNewsBySlug(slug);

        return ResponseEntity.ok(
                ApiResponse.<NewsResponse>builder()
                        .message("News retrieved successfully")
                        .result(news)
                        .build()
        );
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @RequirePermission(PermissionConstants.Admin.NEWS_CREATE)
    public ResponseEntity<ApiResponse<NewsResponse>> createNews(
            @Valid @ModelAttribute NewsCreationRequest request,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {
        log.info("Request to create news: title={}, hasThumbnail={}", 
                request.getTitle(), thumbnail != null);

        NewsResponse news = newsService.createNews(request, thumbnail);

        return ResponseEntity.ok(
                ApiResponse.<NewsResponse>builder()
                        .message("News created successfully")
                        .result(news)
                        .build()
        );
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @RequirePermission(PermissionConstants.Admin.NEWS_UPDATE)
    public ResponseEntity<ApiResponse<NewsResponse>> updateNews(
            @PathVariable String id,
            @Valid @ModelAttribute NewsUpdateRequest request,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {
        log.info("Request to update news: id={}, hasThumbnail={}", id, thumbnail != null);

        NewsResponse news = newsService.updateNews(id, request, thumbnail);

        return ResponseEntity.ok(
                ApiResponse.<NewsResponse>builder()
                        .message("News updated successfully")
                        .result(news)
                        .build()
        );
    }

    @PatchMapping("/{id}/visibility")
    @RequirePermission(PermissionConstants.Admin.NEWS_UPDATE)
    public ResponseEntity<ApiResponse<NewsResponse>> updateNewsVisibility(
            @PathVariable String id,
            @Valid @RequestBody NewsVisibilityRequest request) {
        log.info("Request to update news visibility: id={}, isPublic={}", id, request.getIsPublic());

        NewsResponse news = newsService.updateNewsVisibility(id, request);

        return ResponseEntity.ok(
                ApiResponse.<NewsResponse>builder()
                        .message("News visibility updated successfully")
                        .result(news)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.NEWS_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable String id) {
        log.info("Request to delete news: id={}", id);

        newsService.deleteNews(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("News deleted successfully")
                        .build()
        );
    }

    // Image management endpoints
    @PostMapping("/{newsId}/images")
    @RequirePermission(PermissionConstants.Admin.NEWS_UPDATE)
    public ResponseEntity<ApiResponse<ImageAssetResponse>> uploadNewsImage(
            @PathVariable String newsId,
            @RequestPart("file") MultipartFile file) {
        log.info("Request to upload image for news: newsId={}, filename={}", newsId, file.getOriginalFilename());

        // Get current user ID from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long uploadedBy = null; // TODO: Extract user ID from authentication

        ImageAssetResponse imageAsset = imageAssetService.uploadNewsImage(file, newsId, uploadedBy);

        return ResponseEntity.ok(
                ApiResponse.<ImageAssetResponse>builder()
                        .message("Image uploaded successfully")
                        .result(imageAsset)
                        .build()
        );
    }

    @GetMapping("/{newsId}/images")
    @RequirePermission(PermissionConstants.Admin.NEWS_VIEW_ALL)
    public ResponseEntity<ApiResponse<List<ImageAssetResponse>>> getNewsImages(@PathVariable String newsId) {
        log.info("Request to get all images for news: newsId={}", newsId);

        List<ImageAssetResponse> images = imageAssetService.getNewsImagesByOwnerId(newsId);

        return ResponseEntity.ok(
                ApiResponse.<List<ImageAssetResponse>>builder()
                        .message("News images retrieved successfully")
                        .result(images)
                        .build()
        );
    }

    @GetMapping("/images/{imageId}")
    @RequirePermission(PermissionConstants.Admin.NEWS_VIEW_ALL)
    public ResponseEntity<ApiResponse<ImageAssetResponse>> getNewsImage(@PathVariable String imageId) {
        log.info("Request to get news image: imageId={}", imageId);

        ImageAssetResponse image = imageAssetService.getNewsImage(imageId);

        return ResponseEntity.ok(
                ApiResponse.<ImageAssetResponse>builder()
                        .message("Image retrieved successfully")
                        .result(image)
                        .build()
        );
    }

    @DeleteMapping("/{newsId}/images")
    @RequirePermission(PermissionConstants.Admin.NEWS_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteAllNewsImages(@PathVariable String newsId) {
        log.info("Request to delete all images for news: newsId={}", newsId);

        imageAssetService.deleteAllImagesByOwnerId(newsId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("All images deleted successfully")
                        .build()
        );
    }

    @DeleteMapping("/images/public/{publicId}")
    @RequirePermission(PermissionConstants.Admin.NEWS_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteImageByPublicId(@PathVariable String publicId) {
        log.info("Request to delete image by publicId: {}", publicId);

        imageAssetService.deleteImageByPublicId(publicId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Image deleted successfully")
                        .build()
        );
    }
}

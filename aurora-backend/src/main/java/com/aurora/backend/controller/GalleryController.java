package com.aurora.backend.controller;

import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.GalleryImageResponse;
import com.aurora.backend.service.GalleryService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/gallery")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class GalleryController {

    GalleryService galleryService;

    // Public endpoint - No authentication required
    @GetMapping("/images")
    public ResponseEntity<ApiResponse<List<GalleryImageResponse>>> getGalleryImages(
            @RequestParam(defaultValue = "24") int maxImages) {
        log.info("Fetching gallery images, max: {}", maxImages);
        
        List<GalleryImageResponse> images = galleryService.getGalleryImages(maxImages);
        
        return ResponseEntity.ok(
                ApiResponse.<List<GalleryImageResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .message("Gallery images retrieved successfully")
                        .result(images)
                        .build()
        );
    }
}


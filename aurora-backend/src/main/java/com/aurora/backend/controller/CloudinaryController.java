package com.aurora.backend.controller;

import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/api/v1/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder
    ) {
        log.info("Upload request received: filename={}, size={} bytes, folder={}",
                file.getOriginalFilename(), file.getSize(), folder);

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.<Map<String, Object>>builder()
                                .message("File is empty")
                                .build()
                );
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, folder);

            Map<String, Object> response = new HashMap<>();
            response.put("public_id", uploadResult.get("public_id"));
            response.put("url", uploadResult.get("secure_url"));
            response.put("format", uploadResult.get("format"));
            response.put("resource_type", uploadResult.get("resource_type"));
            response.put("bytes", uploadResult.get("bytes"));
            response.put("width", uploadResult.get("width"));
            response.put("height", uploadResult.get("height"));
            response.put("created_at", uploadResult.get("created_at"));

            return ResponseEntity.ok(
                    ApiResponse.<Map<String, Object>>builder()
                            .message("File uploaded successfully")
                            .result(response)
                            .build()
            );

        } catch (IOException e) {
            log.error("Failed to upload file", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.<Map<String, Object>>builder()
                            .message("Failed to upload file: " + e.getMessage())
                            .build()
            );
        }
    }


    @PostMapping("/upload-multiple")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadMultipleFiles(
            @RequestPart("files") MultipartFile[] files,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder
    ) {
        log.info("Multiple upload request received: count={}, folder={}", files.length, folder);

        try {
            Map<String, Object> results = new HashMap<>();
            int successCount = 0;
            int failCount = 0;

            for (MultipartFile file : files) {
                try {
                    Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, folder);
                    results.put(file.getOriginalFilename(), Map.of(
                            "status", "success",
                            "public_id", uploadResult.get("public_id"),
                            "url", uploadResult.get("secure_url")
                    ));
                    successCount++;
                } catch (IOException e) {
                    results.put(file.getOriginalFilename(), Map.of(
                            "status", "failed",
                            "error", e.getMessage()
                    ));
                    failCount++;
                }
            }

            results.put("summary", Map.of(
                    "total", files.length,
                    "success", successCount,
                    "failed", failCount
            ));

            return ResponseEntity.ok(
                    ApiResponse.<Map<String, Object>>builder()
                            .message("Upload completed")
                            .result(results)
                            .build()
            );

        } catch (Exception e) {
            log.error("Failed to upload multiple files", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.<Map<String, Object>>builder()
                            .message("Failed to upload files: " + e.getMessage())
                            .build()
            );
        }
    }

    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteFile(
            @PathVariable String publicId
    ) {
        log.info("Delete request received: public_id={}", publicId);

        try {
            Map<String, Object> deleteResult = cloudinaryService.deleteFile(publicId);

            return ResponseEntity.ok(
                    ApiResponse.<Map<String, Object>>builder()
                            .message("File deleted successfully")
                            .result(deleteResult)
                            .build()
            );

        } catch (IOException e) {
            log.error("Failed to delete file", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.<Map<String, Object>>builder()
                            .message("Failed to delete file: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/optimize/{publicId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getOptimizedUrl(
            @PathVariable String publicId,
            @RequestParam(required = false) Integer width,
            @RequestParam(required = false) Integer height,
            @RequestParam(defaultValue = "auto") String quality
    ) {
        log.info("Optimize request received: public_id={}, width={}, height={}, quality={}",
                publicId, width, height, quality);

        String optimizedUrl = cloudinaryService.getOptimizedImageUrl(publicId, width, height, quality);

        return ResponseEntity.ok(
                ApiResponse.<Map<String, String>>builder()
                        .message("Optimized URL generated")
                        .result(Map.of(
                                "public_id", publicId,
                                "optimized_url", optimizedUrl
                        ))
                        .build()
        );
    }

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<Map<String, String>>> testConnection() {
        log.info("Cloudinary connection test requested");

        try {
            String testUrl = cloudinaryService.getSecureUrl("test");

            return ResponseEntity.ok(
                    ApiResponse.<Map<String, String>>builder()
                            .message("Cloudinary is configured correctly")
                            .result(Map.of(
                                    "status", "connected",
                                    "test_url", testUrl
                            ))
                            .build()
            );

        } catch (Exception e) {
            log.error("Cloudinary connection test failed", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.<Map<String, String>>builder()
                            .message("Cloudinary connection failed: " + e.getMessage())
                            .build()
            );
        }
    }
}

package com.aurora.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface CloudinaryService {
    Map<String, Object> uploadFile(MultipartFile file, String folder, String publicId) throws IOException;
    Map<String, Object> uploadFile(MultipartFile file, String folder) throws IOException;
    Map<String, Object> deleteFile(String publicId) throws IOException;
    String getOptimizedImageUrl(String publicId, Integer width, Integer height, String quality);
    String getSecureUrl(String publicId);
    String extractPublicId(String cloudinaryUrl);
}

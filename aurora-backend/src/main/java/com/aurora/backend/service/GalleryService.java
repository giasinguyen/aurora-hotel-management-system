package com.aurora.backend.service;

import com.aurora.backend.dto.response.GalleryImageResponse;

import java.util.List;

public interface GalleryService {
    List<GalleryImageResponse> getGalleryImages(int maxImages);
}


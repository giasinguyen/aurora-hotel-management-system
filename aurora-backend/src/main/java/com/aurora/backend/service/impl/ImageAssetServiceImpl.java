package com.aurora.backend.service.impl;

import com.aurora.backend.dto.response.ImageAssetResponse;
import com.aurora.backend.entity.ImageAsset;
import com.aurora.backend.entity.News;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.enums.ImageStatus;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.ImageAssetMapper;
import com.aurora.backend.repository.ImageAssetRepository;
import com.aurora.backend.repository.NewsRepository;
import com.aurora.backend.service.CloudinaryService;
import com.aurora.backend.service.ImageAssetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageAssetServiceImpl implements ImageAssetService {

    private final ImageAssetRepository imageAssetRepository;
    private final NewsRepository newsRepository;
    private final CloudinaryService cloudinaryService;
    private final ImageAssetMapper imageAssetMapper;

    @Transactional
    @Async
    public ImageAssetResponse uploadNewsImage(MultipartFile file, String newsId, Long uploadedBy) {
        log.info("Uploading image for news: newsId={}, uploadedBy={}, filename={}", 
                newsId, uploadedBy, file.getOriginalFilename());

        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));

        try {
            // Upload to Cloudinary
            String folder = "news/" + newsId;
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, folder);

            // Create ImageAsset entity
            ImageAsset imageAsset = ImageAsset.builder()
                    .publicId((String) uploadResult.get("public_id"))
                    .url((String) uploadResult.get("secure_url"))
                    .width((Integer) uploadResult.get("width"))
                    .height((Integer) uploadResult.get("height"))
                    .sizeBytes(((Number) uploadResult.get("bytes")).longValue())
                    .mimeType((String) uploadResult.get("format"))
                    .ownerType("news")
                    .status(ImageStatus.ATTACHED)
                    .news(news)
                    .build();

            imageAsset = imageAssetRepository.save(imageAsset);
            log.info("Image uploaded successfully: imageId={}, publicId={}", 
                    imageAsset.getId(), imageAsset.getPublicId());

            return imageAssetMapper.toImageAssetResponse(imageAsset);

        } catch (IOException e) {
            log.error("Failed to upload image for news: newsId={}", newsId, e);
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ImageAssetResponse getNewsImage(String imageId) {
        log.info("Getting news image: imageId={}", imageId);

        ImageAsset imageAsset = imageAssetRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        return imageAssetMapper.toImageAssetResponse(imageAsset);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageAssetResponse> getNewsImagesByOwnerId(String newsId) {
        log.info("Getting all images for news: newsId={}", newsId);

        List<ImageAsset> images = imageAssetRepository.findByNewsId(newsId);

        return images.stream()
                .map(imageAssetMapper::toImageAssetResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Async
    public void deleteAllImagesByOwnerId(String newsId) {
        log.info("Deleting all images for news: newsId={}", newsId);

        List<ImageAsset> images = imageAssetRepository.findByNewsId(newsId);

        for (ImageAsset image : images) {
            try {
                cloudinaryService.deleteFile(image.getPublicId());
                log.info("Deleted image from Cloudinary: publicId={}", image.getPublicId());
            } catch (IOException e) {
                log.error("Failed to delete image from Cloudinary: publicId={}", 
                        image.getPublicId(), e);
            }
        }

        imageAssetRepository.deleteByNewsId(newsId);
        log.info("Deleted all images for news: newsId={}, count={}", newsId, images.size());
    }

    @Override
    @Transactional
    @Async
    public void deleteImageByPublicId(String publicId) {
        log.info("Deleting image by publicId: {}", publicId);

        ImageAsset imageAsset = imageAssetRepository.findByPublicId(publicId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        try {
            cloudinaryService.deleteFile(publicId);
            imageAssetRepository.delete(imageAsset);
            log.info("Image deleted successfully: publicId={}", publicId);
        } catch (IOException e) {
            log.error("Failed to delete image: publicId={}", publicId, e);
            throw new AppException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }
}

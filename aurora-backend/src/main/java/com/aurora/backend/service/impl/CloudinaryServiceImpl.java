package com.aurora.backend.service.impl;

import com.aurora.backend.service.CloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, Object> uploadFile(MultipartFile file, String folder, String publicId) throws IOException {
        log.info("Uploading file to Cloudinary: folder={}, filename={}, size={} bytes",
                folder, file.getOriginalFilename(), file.getSize());

        try {
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("resource_type", "auto");
            uploadParams.put("folder", folder);
            uploadParams.put("use_filename", true);
            uploadParams.put("unique_filename", true);
            uploadParams.put("overwrite", false);

            if (publicId != null && !publicId.isEmpty()) {
                uploadParams.put("public_id", publicId);
            }

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            log.info("File uploaded successfully: public_id={}, url={}, format={}, size={}",
                    uploadResult.get("public_id"),
                    uploadResult.get("secure_url"),
                    uploadResult.get("format"),
                    uploadResult.get("bytes"));

            return uploadResult;

        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary: folder={}, filename={}",
                    folder, file.getOriginalFilename(), e);
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> uploadFile(MultipartFile file, String folder) throws IOException {
        return uploadFile(file, folder, null);
    }

    @Override
    public Map<String, Object> deleteFile(String publicId) throws IOException {
        log.info("Deleting file from Cloudinary: public_id={}", publicId);

        try {
            Map<String, Object> deleteResult = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            String result = (String) deleteResult.get("result");
            if ("ok".equals(result)) {
                log.info("File deleted successfully: public_id={}", publicId);
            } else {
                log.warn("File deletion returned status: {}, public_id={}", result, publicId);
            }

            return deleteResult;

        } catch (IOException e) {
            log.error("Failed to delete file from Cloudinary: public_id={}", publicId, e);
            throw new IOException("Failed to delete file from Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public String getOptimizedImageUrl(String publicId, Integer width, Integer height, String quality) {
        log.debug("Generating optimized image URL: public_id={}, width={}, height={}, quality={}",
                publicId, width, height, quality);

        Transformation<?> transformation = new Transformation<>();

        if (width != null) {
            transformation.width(width);
        }
        if (height != null) {
            transformation.height(height);
        }
        if (quality != null && !quality.isEmpty()) {
            transformation.quality(quality);
        }

        transformation.fetchFormat("auto");
        transformation.crop("fill"); 

        return cloudinary.url()
                .transformation(transformation)
                .secure(true)
                .generate(publicId);
    }

    @Override
    public String getSecureUrl(String publicId) {
        log.debug("Generating secure URL: public_id={}", publicId);
        return cloudinary.url().secure(true).generate(publicId);
    }

    @Override
    public String extractPublicId(String cloudinaryUrl) {
        if (cloudinaryUrl == null || cloudinaryUrl.isEmpty()) {
            return null;
        }

        try {
            String[] parts = cloudinaryUrl.split("/");
            if (parts.length < 2) {
                return null;
            }

            String filename = parts[parts.length - 1];

            StringBuilder publicIdBuilder = new StringBuilder();
            boolean foundUpload = false;
            for (int i = 0; i < parts.length - 1; i++) {
                if (foundUpload) {
                    if (parts[i].matches("^v\\d+$")) {
                        continue;
                    }
                    if (publicIdBuilder.length() > 0) {
                        publicIdBuilder.append("/");
                    }
                    publicIdBuilder.append(parts[i]);
                }
                if ("upload".equals(parts[i])) {
                    foundUpload = true;
                }
            }

            // Append filename without extension
            if (publicIdBuilder.length() > 0) {
                publicIdBuilder.append("/");
            }
            String filenameWithoutExt = filename.contains(".") 
                ? filename.substring(0, filename.lastIndexOf(".")) 
                : filename;
            publicIdBuilder.append(filenameWithoutExt);

            String publicId = publicIdBuilder.toString();
            log.debug("Extracted public_id from URL: {}", publicId);
            return publicId;

        } catch (Exception e) {
            log.error("Failed to extract public_id from URL: {}", cloudinaryUrl, e);
            return null;
        }
    }
}

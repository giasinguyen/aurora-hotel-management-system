package com.aurora.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;


@Slf4j
@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Value("${cloudinary.secure:true}")
    private boolean secure;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", String.valueOf(secure));

        log.info("Cloudinary initialized with cloud_name: {}", cloudName);
        return new Cloudinary(config);
    }

    @Bean
    @SuppressWarnings("unchecked")
    public Map<String, Object> cloudinaryUploadOptions() {
        return ObjectUtils.asMap(
                "resource_type", "auto", // Tự động detect loại file (image/video/raw)
                "use_filename", true,    // Giữ tên file gốc
                "unique_filename", true, // Thêm unique identifier vào tên file
                "overwrite", false       // Không ghi đè file cũ
        );
    }
}

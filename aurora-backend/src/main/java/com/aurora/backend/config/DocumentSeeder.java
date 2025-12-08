package com.aurora.backend.config;

import com.aurora.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
@Slf4j
@Profile({"dev", "local"})
public class DocumentSeeder {

    private final DocumentService documentService;

    @Bean
    @Order(2)
    public CommandLineRunner initRagDocument() {
        return args -> {
            if (documentService.isDocumentHasFile()) {
                log.info("Documents already exist in database. Skipping document seeding.");
                return;
            }

            log.info("No documents found in database. Loading documents from classpath:docs");
            loadDocumentsFromClasspath();
        };
    }

    private void loadDocumentsFromClasspath() {
        String defaultDescription = "Default documents uploaded by SYSTEM for Aurora chatbot.";
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:docs/*");

            int loadedCount = 0;
            for (Resource resource : resources) {
                if (resource.exists() && resource.isReadable()) {
                    String filename = resource.getFilename();
                    if (filename != null && isValidDocumentFile(filename)) {
                        try {
                            byte[] fileBytes = resource.getInputStream().readAllBytes();
                            String contentType = determineContentType(filename);

                            documentService.loadFileFromBytes(filename, contentType, fileBytes, defaultDescription, true);
                            loadedCount++;
                            log.info("Successfully loaded document: {}", filename);
                        } catch (Exception e) {
                            log.error("Error loading document {}: {}", filename, e.getMessage());
                        }
                    }
                }
            }

            log.info("Document seeding completed. Loaded {} documents.", loadedCount);
        } catch (IOException e) {
            log.error("Error loading documents from classpath: {}", e.getMessage());
        }
    }

    private boolean isValidDocumentFile(String fileName) {
        String lowerFileName = fileName.toLowerCase();
        return lowerFileName.endsWith(".pdf") ||
                lowerFileName.endsWith(".docx") ||
                lowerFileName.endsWith(".doc") ||
                lowerFileName.endsWith(".txt") ||
                lowerFileName.endsWith(".md");
    }

    private String determineContentType(String filename) {
        String lowerFileName = filename.toLowerCase();
        if (lowerFileName.endsWith(".pdf")) {
            return "application/pdf";
        } else if (lowerFileName.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (lowerFileName.endsWith(".doc")) {
            return "application/msword";
        } else if (lowerFileName.endsWith(".txt")) {
            return "text/plain";
        } else if (lowerFileName.endsWith(".md")) {
            return "text/markdown";
        } else {
            return "application/octet-stream";
        }
    }
}

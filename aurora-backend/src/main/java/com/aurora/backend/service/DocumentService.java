package com.aurora.backend.service;

import com.aurora.backend.entity.Document;
import com.aurora.backend.repository.DocumentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final EmbeddingService embeddingService;
    private final CloudinaryService cloudinaryService;
    private final ObjectMapper objectMapper;

    @Transactional
    public Document uploadFile(MultipartFile file, Boolean shouldEmbed, String description) throws IOException {
        log.info("Uploading file: {}, shouldEmbed: {}, description: {}", file.getOriginalFilename(), shouldEmbed, description);

        // Upload to Cloudinary
        CompletableFuture<Map<String, Object>> cloudinaryUploadFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return cloudinaryService.uploadFile(file, "documents");
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload to Cloudinary", e);
            }
        });

        // Wait for Cloudinary upload
        Map<String, Object> uploadResult = cloudinaryUploadFuture.join();
        String docUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        // Create document entity
        Document document = Document.builder()
                .filename(file.getOriginalFilename())
                .fileType(file.getContentType())
                .size(file.getSize())
                .docUrl(docUrl)
                .publicId(publicId)
                .isEmbed(shouldEmbed != null ? shouldEmbed : false)
                .description(description)
                .build();

        Document savedDocument = documentRepository.save(document);

        // Embed document if requested (asynchronously)
        if (Boolean.TRUE.equals(shouldEmbed)) {
            CompletableFuture.runAsync(() -> {
                try {
                    EmbeddingService.EmbeddingResult result = embeddingService.indexFile(savedDocument, file.getBytes());
                    updateDocumentMetadata(savedDocument.getId(), result.getMetadata());
                    updateDocumentChunks(savedDocument.getId(), result.getTotalChunks());
                    log.info("Successfully embedded document: {}", savedDocument.getFilename());
                } catch (Exception e) {
                    log.error("Failed to embed document {}: {}", savedDocument.getFilename(), e.getMessage(), e);
                }
            });
        }

        return savedDocument;
    }

    public List<Document> listFiles() {
        return documentRepository.findAll();
    }

    public Document getDocument(String id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    @Transactional
    public Document updateFile(String id, MultipartFile newFile, Boolean shouldEmbed, String description) throws IOException {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Delete old file from Cloudinary
        try {
            cloudinaryService.deleteFile(document.getPublicId());
        } catch (Exception e) {
            log.warn("Failed to delete old file from Cloudinary: {}", e.getMessage());
        }

        // Delete old embeddings if exists
        if (Boolean.TRUE.equals(document.getIsEmbed())) {
            try {
                embeddingService.deleteFileEmbeddings(id);
            } catch (Exception e) {
                log.warn("Failed to delete old embeddings: {}", e.getMessage());
            }
        }

        // Upload new file to Cloudinary
        Map<String, Object> uploadResult = cloudinaryService.uploadFile(newFile, "documents");
        String docUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        // Update document
        document.setFilename(newFile.getOriginalFilename());
        document.setFileType(newFile.getContentType());
        document.setSize(newFile.getSize());
        document.setDocUrl(docUrl);
        document.setPublicId(publicId);
        document.setIsEmbed(shouldEmbed != null ? shouldEmbed : false);
        document.setDescription(description);
        document.setTotalChunks(null);
        document.setMetadata(null);

        Document updatedDocument = documentRepository.save(document);

        // Embed new document if requested (asynchronously)
        if (Boolean.TRUE.equals(shouldEmbed)) {
            CompletableFuture.runAsync(() -> {
                try {
                    EmbeddingService.EmbeddingResult result = embeddingService.indexFile(updatedDocument, newFile.getBytes());
                    updateDocumentMetadata(updatedDocument.getId(), result.getMetadata());
                    updateDocumentChunks(updatedDocument.getId(), result.getTotalChunks());
                    log.info("Successfully re-embedded document: {}", updatedDocument.getFilename());
                } catch (Exception e) {
                    log.error("Failed to re-embed document {}: {}", updatedDocument.getFilename(), e.getMessage(), e);
                }
            });
        }

        return updatedDocument;
    }

    @Transactional
    public void deleteFile(String id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Delete from Cloudinary
        try {
            cloudinaryService.deleteFile(document.getPublicId());
        } catch (Exception e) {
            log.warn("Failed to delete file from Cloudinary: {}", e.getMessage());
        }

        // Delete embeddings if exists
        if (Boolean.TRUE.equals(document.getIsEmbed())) {
            try {
                embeddingService.deleteFileEmbeddings(id);
            } catch (Exception e) {
                log.warn("Failed to delete embeddings: {}", e.getMessage());
            }
        }

        documentRepository.deleteById(id);
        log.info("Deleted document: {} (ID: {})", document.getFilename(), id);
    }

    @Transactional
    public Document updateMetadata(String id, String description, Boolean shouldEmbed) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Update description if provided
        if (description != null) {
            document.setDescription(description);
        }

        // Update shouldEmbed if provided and different from current state
        if (shouldEmbed != null && !shouldEmbed.equals(document.getIsEmbed())) {
            if (Boolean.TRUE.equals(shouldEmbed)) {
                // Need to embed the document
                document.setIsEmbed(true);
                CompletableFuture.runAsync(() -> {
                    try {
                        byte[] fileBytes = downloadFileFromCloudinary(document.getDocUrl());
                        EmbeddingService.EmbeddingResult result = embeddingService.indexFile(document, fileBytes);
                        updateDocumentMetadata(document.getId(), result.getMetadata());
                        updateDocumentChunks(document.getId(), result.getTotalChunks());
                        log.info("Successfully embedded document: {}", document.getFilename());
                    } catch (Exception e) {
                        log.error("Failed to embed document {}: {}", document.getFilename(), e.getMessage(), e);
                    }
                });
            } else {
                // Need to remove embedding
                if (Boolean.TRUE.equals(document.getIsEmbed())) {
                    try {
                        embeddingService.deleteFileEmbeddings(id);
                    } catch (Exception e) {
                        log.warn("Failed to delete embeddings: {}", e.getMessage());
                    }
                }
                document.setIsEmbed(false);
                document.setTotalChunks(null);
                document.setMetadata(null);
            }
        }

        return documentRepository.save(document);
    }

    @Transactional
    public Document removeChunking(String id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!Boolean.TRUE.equals(document.getIsEmbed())) {
            throw new RuntimeException("Document is not embedded");
        }

        // Delete embeddings
        embeddingService.deleteFileEmbeddings(id);

        // Update document
        document.setIsEmbed(false);
        document.setTotalChunks(null);
        document.setMetadata(null);

        return documentRepository.save(document);
    }

    @Transactional
    public Document reChunkDocument(String id) throws IOException {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Delete old embeddings if exists
        if (Boolean.TRUE.equals(document.getIsEmbed())) {
            embeddingService.deleteFileEmbeddings(id);
        }

        // Download file from Cloudinary and re-embed
        try {
            byte[] fileBytes = downloadFileFromCloudinary(document.getDocUrl());
            EmbeddingService.EmbeddingResult result = embeddingService.indexFile(document, fileBytes);
            
            document.setIsEmbed(true);
            updateDocumentMetadata(document.getId(), result.getMetadata());
            updateDocumentChunks(document.getId(), result.getTotalChunks());
            
            return documentRepository.save(document);
        } catch (Exception e) {
            log.error("Failed to re-chunk document {}: {}", document.getFilename(), e.getMessage(), e);
            throw new RuntimeException("Failed to re-chunk document", e);
        }
    }

    public boolean isDocumentHasFile() {
        return documentRepository.count() > 0;
    }

    @Transactional
    public void reindexAllFiles() {
        List<Document> allFiles = documentRepository.findAll();
        log.info("Starting reindex of {} files", allFiles.size());

        for (Document document : allFiles) {
            if (Boolean.TRUE.equals(document.getIsEmbed())) {
                try {
                    byte[] fileBytes = downloadFileFromCloudinary(document.getDocUrl());
                    EmbeddingService.EmbeddingResult result = embeddingService.reindexFile(document, fileBytes);
                    updateDocumentMetadata(document.getId(), result.getMetadata());
                    updateDocumentChunks(document.getId(), result.getTotalChunks());
                    log.info("Successfully reindexed file: {}", document.getFilename());
                } catch (Exception e) {
                    log.error("Failed to reindex file {}: {}", document.getFilename(), e.getMessage());
                }
            }
        }

        log.info("Completed reindexing all files");
    }

    public boolean isFileIndexed(String id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return Boolean.TRUE.equals(document.getIsEmbed()) && embeddingService.isFileIndexed(id);
    }

    @Transactional
    public void loadFileFromBytes(String filename, String contentType, byte[] fileBytes, String description, Boolean shouldEmbed) throws IOException {
        // Upload to Cloudinary
        Map<String, Object> uploadResult = uploadBytesToCloudinary(fileBytes, filename);
        String docUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        Document document = Document.builder()
                .filename(filename)
                .fileType(contentType)
                .size((long) fileBytes.length)
                .docUrl(docUrl)
                .publicId(publicId)
                .description(description)
                .isEmbed(shouldEmbed != null ? shouldEmbed : false)
                .build();

        Document savedDocument = documentRepository.save(document);

        if (Boolean.TRUE.equals(shouldEmbed)) {
            try {
                EmbeddingService.EmbeddingResult result = embeddingService.indexFile(savedDocument, fileBytes);
                updateDocumentMetadata(savedDocument.getId(), result.getMetadata());
                updateDocumentChunks(savedDocument.getId(), result.getTotalChunks());
                log.info("Successfully embedded seeded document: {}", savedDocument.getFilename());
            } catch (Exception e) {
                log.error("Failed to embed seeded document {}: {}", savedDocument.getFilename(), e.getMessage(), e);
            }
        }
    }

    private byte[] downloadFileFromCloudinary(String url) throws IOException {
        // Implementation to download file from Cloudinary URL
        // You can use RestTemplate or HttpClient
        try {
            java.net.URL cloudinaryUrl = new java.net.URL(url);
            return cloudinaryUrl.openStream().readAllBytes();
        } catch (Exception e) {
            throw new IOException("Failed to download file from Cloudinary", e);
        }
    }

    private Map<String, Object> uploadBytesToCloudinary(byte[] fileBytes, String filename) throws IOException {
        // Create a custom MultipartFile implementation from bytes
        MultipartFile multipartFile = new CustomMultipartFile(fileBytes, filename);
        return cloudinaryService.uploadFile(multipartFile, "documents");
    }

    /**
         * Custom MultipartFile implementation for converting byte arrays to MultipartFile
         */
        private record CustomMultipartFile(byte[] content, String filename) implements MultipartFile {

        @Override
            public String getName() {
                return filename;
            }

            @Override
            public String getOriginalFilename() {
                return filename;
            }

            @Override
            public String getContentType() {
                return "application/octet-stream";
            }

            @Override
            public boolean isEmpty() {
                return content == null || content.length == 0;
            }

            @Override
            public long getSize() {
                return content.length;
            }

            @Override
            public byte[] getBytes() {
                return content;
            }

            @Override
            public InputStream getInputStream() {
                return new ByteArrayInputStream(content);
            }

            @Override
            public void transferTo(File dest) throws IOException, IllegalStateException {
                try (FileOutputStream fos = new FileOutputStream(dest)) {
                    fos.write(content);
                }
            }
        }

    public void updateDocumentMetadata(String id, Map<String, Object> metadataMap) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        try {
            String metadataJson = objectMapper.writeValueAsString(metadataMap);
            document.setMetadata(metadataJson);
            documentRepository.save(document);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize metadata: {}", e.getMessage());
            throw new RuntimeException("Failed to update document metadata", e);
        }
    }

    public void updateDocumentChunks(String id, Integer totalChunks) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        document.setTotalChunks(totalChunks);
        documentRepository.save(document);
    }
}

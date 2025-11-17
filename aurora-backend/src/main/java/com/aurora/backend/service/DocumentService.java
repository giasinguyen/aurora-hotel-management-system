package com.aurora.backend.service;

import com.aurora.backend.entity.DocumentContent;
import com.aurora.backend.entity.DocumentMetadata;
import com.aurora.backend.repository.DocumentContentRepository;
import com.aurora.backend.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentContentRepository documentContentRepository;
    private final EmbeddingService embeddingService;

    public DocumentMetadata uploadFile(MultipartFile file) throws IOException {
        DocumentMetadata metadata = DocumentMetadata.builder()
                .filename(file.getOriginalFilename())
                .fileType(file.getContentType())
                .size(file.getSize())
                .build();

        DocumentContent content = DocumentContent.builder()
                .document(metadata)
                .content(file.getBytes())
                .build();

        metadata.setFileContent(content);

        DocumentMetadata savedMetadata = documentRepository.save(metadata);

        try {
            embeddingService.indexFile(savedMetadata);
            log.info("Đã tạo embeddings cho file: {}", savedMetadata.getFilename());
        } catch (Exception e) {
            log.error("Lỗi khi tạo embeddings cho file {}: {}", savedMetadata.getFilename(), e.getMessage(), e);
        }

        return savedMetadata;
    }

    public List<DocumentMetadata> listFiles() {
        return documentRepository.findAll();
    }

    public byte[] downloadFile(Long id) throws IOException {
        DocumentMetadata metadata = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (metadata.getFileContent() == null) {
            throw new RuntimeException("File content not found");
        }

        return metadata.getFileContent().getContent();
    }

    public DocumentMetadata updateFile(Long id, MultipartFile newFile) throws IOException {
        DocumentMetadata metadata = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        metadata.setFilename(newFile.getOriginalFilename());
        metadata.setFileType(newFile.getContentType());
        metadata.setSize(newFile.getSize());

        if (metadata.getFileContent() == null) {
            DocumentContent content = DocumentContent.builder()
                    .document(metadata)
                    .content(newFile.getBytes())
                    .build();
            metadata.setFileContent(content);
        } else {
            metadata.getFileContent().setContent(newFile.getBytes());
        }

        DocumentMetadata updatedMetadata = documentRepository.save(metadata);
        log.info("Đã cập nhật metadata cho file: {} (ID: {})", updatedMetadata.getFilename(), updatedMetadata.getId());

        try {
            embeddingService.reindexFile(updatedMetadata);
            log.info("Đã reindex embeddings cho file: {}", updatedMetadata.getFilename());
        } catch (Exception e) {
            log.error("Lỗi khi reindex embeddings cho file {}: {}", updatedMetadata.getFilename(), e.getMessage(), e);
        }

        return updatedMetadata;
    }

    public void deleteFile(Long id) throws IOException {
        DocumentMetadata metadata = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        try {
            embeddingService.deleteFileEmbeddings(id);
            log.info("Đã xóa embeddings của file: {} (ID: {})", metadata.getFilename(), id);
        } catch (Exception e) {
            log.error("Lỗi khi xóa embeddings của file {}: {}", metadata.getFilename(), e.getMessage(), e);
        }

        documentRepository.deleteById(id);
        log.info("Đã xóa file khỏi database: {} (ID: {})", metadata.getFilename(), id);
    }


    public void reindexAllFiles() {
        List<DocumentMetadata> allFiles = documentRepository.findAll();
        log.info("Bắt đầu reindex {} files", allFiles.size());

        for (DocumentMetadata metadata : allFiles) {
            try {
                embeddingService.reindexFile(metadata);
                log.info("Reindex thành công file: {}", metadata.getFilename());
            } catch (Exception e) {
                log.error("Lỗi khi reindex file {}: {}", metadata.getFilename(), e.getMessage());
            }
        }

        log.info("Hoàn thành reindex tất cả files");
    }


    public boolean isFileIndexed(Long id) {
        return embeddingService.isFileIndexed(id);
    }


    public DocumentMetadata getFileWithContent(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }


    public boolean hasFileContent(Long id) {
        DocumentMetadata metadata = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
        return metadata.getFileContent() != null && metadata.getFileContent().getContent() != null;
    }
}

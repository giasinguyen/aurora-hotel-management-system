package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.entity.Document;
import com.aurora.backend.service.DocumentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentController {
    DocumentService documentService;

    @PostMapping("/upload")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_CREATE)
    public ResponseEntity<ApiResponse<Document>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "shouldEmbed", required = false, defaultValue = "false") Boolean shouldEmbed,
            @RequestParam(value = "description", required = false) String description
    ) throws IOException {
        log.info("Request to upload document: filename={}, shouldEmbed={}, description={}", file.getOriginalFilename(), shouldEmbed, description);

        Document document = documentService.uploadFile(file, shouldEmbed, description);

        return ResponseEntity.ok(
                ApiResponse.<Document>builder()
                        .message("Document uploaded successfully")
                        .result(document)
                        .build()
        );
    }

    @GetMapping
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_VIEW)
    public ResponseEntity<ApiResponse<List<Document>>> listFiles() {
        log.info("Request to get all documents");

        List<Document> documents = documentService.listFiles();

        return ResponseEntity.ok(
                ApiResponse.<List<Document>>builder()
                        .message("Documents retrieved successfully")
                        .result(documents)
                        .build()
        );
    }

    @GetMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_VIEW)
    public ResponseEntity<ApiResponse<Document>> getDocument(@PathVariable String id) {
        log.info("Request to get document: id={}", id);

        Document document = documentService.getDocument(id);

        return ResponseEntity.ok(
                ApiResponse.<Document>builder()
                        .message("Document retrieved successfully")
                        .result(document)
                        .build()
        );
    }

    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_UPDATE)
    public ResponseEntity<ApiResponse<Document>> updateFile(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "shouldEmbed", required = false, defaultValue = "false") Boolean shouldEmbed,
            @RequestParam(value = "description", required = false) String description
    ) throws IOException {
        log.info("Request to update document: id={}, filename={}, shouldEmbed={}, description={}", id, file.getOriginalFilename(), shouldEmbed, description);

        Document document = documentService.updateFile(id, file, shouldEmbed, description);

        return ResponseEntity.ok(
                ApiResponse.<Document>builder()
                        .message("Document updated successfully")
                        .result(document)
                        .build()
        );
    }

    @PostMapping("/{id}/metadata")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_UPDATE)
    public ResponseEntity<ApiResponse<Document>> updateMetadata(
            @PathVariable String id,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "shouldEmbed", required = false) Boolean shouldEmbed
    ) {
        log.info("Request to update document metadata: id={}, description={}, shouldEmbed={}", id, description, shouldEmbed);

        Document document = documentService.updateMetadata(id, description, shouldEmbed);

        return ResponseEntity.ok(
                ApiResponse.<Document>builder()
                        .message("Document metadata updated successfully")
                        .result(document)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String id) {
        log.info("Request to delete document: id={}", id);

        documentService.deleteFile(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Document deleted successfully")
                        .build()
        );
    }

    @PostMapping("/{id}/remove-chunking")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_UPDATE)
    public ResponseEntity<ApiResponse<Document>> removeChunking(@PathVariable String id) {
        log.info("Request to remove chunking for document: id={}", id);

        Document document = documentService.removeChunking(id);

        return ResponseEntity.ok(
                ApiResponse.<Document>builder()
                        .message("Document chunking removed successfully")
                        .result(document)
                        .build()
        );
    }

    @PostMapping("/{id}/re-chunk")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_UPDATE)
    public ResponseEntity<ApiResponse<Document>> reChunkDocument(@PathVariable String id) throws IOException {
        log.info("Request to re-chunk document: id={}", id);

        Document document = documentService.reChunkDocument(id);

        return ResponseEntity.ok(
                ApiResponse.<Document>builder()
                        .message("Document re-chunked successfully")
                        .result(document)
                        .build()
        );
    }

    @PostMapping("/reindex-all")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_UPDATE)
    public ResponseEntity<ApiResponse<Void>> reindexAllFiles() {
        log.info("Request to reindex all documents");

        documentService.reindexAllFiles();

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("All documents reindexed successfully")
                        .build()
        );
    }

    @GetMapping("/{id}/is-indexed")
    @RequirePermission(PermissionConstants.Admin.DOCUMENT_VIEW)
    public ResponseEntity<ApiResponse<Boolean>> isFileIndexed(@PathVariable String id) {
        log.info("Request to check if document is indexed: id={}", id);

        Boolean isIndexed = documentService.isFileIndexed(id);

        return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                        .message("Document index status retrieved successfully")
                        .result(isIndexed)
                        .build()
        );
    }
}

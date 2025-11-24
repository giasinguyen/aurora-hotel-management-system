package com.aurora.backend.controller;

import com.aurora.backend.entity.DocumentMetadata;
import com.aurora.backend.service.DocumentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/document")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentController {
    DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentMetadata> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(documentService.uploadFile(file));
    }

    @GetMapping
    public ResponseEntity<List<DocumentMetadata>> listFiles() {
        return ResponseEntity.ok(documentService.listFiles());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) throws IOException {
        byte[] data = documentService.downloadFile(id);
        DocumentMetadata meta = documentService.listFiles().stream().filter(f -> f.getId().equals(id)).findFirst().orElseThrow();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(meta.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + meta.getFilename() + "\"")
                .body(data);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentMetadata> updateFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(documentService.updateFile(id, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) throws IOException {
        documentService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}

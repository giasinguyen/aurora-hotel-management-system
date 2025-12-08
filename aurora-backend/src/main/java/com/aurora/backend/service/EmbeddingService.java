package com.aurora.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentParser;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.parser.apache.tika.ApacheTikaDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmbeddingService {
    private static final String METADATA_DOCUMENT_ID = "documentId";
    private static final String METADATA_FILENAME = "filename";
    private static final String METADATA_FILE_TYPE = "fileType";
    private static final String METADATA_CHUNK_INDEX = "chunkIndex";
    private static final String METADATA_TOTAL_CHUNKS = "totalChunks";
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;
    private final DocumentParser documentParser = new ApacheTikaDocumentParser();
    private final DocumentSplitter documentSplitter = DocumentSplitters.recursive(1500, 200);
    private final ObjectMapper objectMapper;

    public void deleteFileEmbeddings(String fileId) {
        try {
            log.info("Starting to delete embeddings for file ID: {}", fileId);

            List<String> embeddingIds = findEmbeddingIdsByFileId(fileId);

            if (embeddingIds.isEmpty()) {
                log.warn("No embeddings found for file ID: {}", fileId);
                return;
            }

            for (String embeddingId : embeddingIds) {
                embeddingStore.remove(embeddingId);
            }

            log.info("Deleted {} embeddings for file ID: {}", embeddingIds.size(), fileId);
        } catch (Exception e) {
            log.error("Error deleting embeddings for file ID {}: {}", fileId, e.getMessage(), e);
            throw new RuntimeException("Cannot delete embeddings: " + e.getMessage(), e);
        }
    }

    /**
     * Create embeddings for file and save to vector store
     * Returns metadata and total chunks for the document
     */
    public EmbeddingResult indexFile(com.aurora.backend.entity.Document doc, byte[] fileBytes) throws IOException {
        try {
            log.info("Starting to index file: {} (ID: {})", doc.getFilename(), doc.getId());

            if (fileBytes == null || fileBytes.length == 0) {
                throw new IOException("File bytes are empty");
            }

            Document document = documentParser.parse(new java.io.ByteArrayInputStream(fileBytes));
            log.debug("Parsed document, length: {} characters", document.text().length());

            List<TextSegment> segments = documentSplitter.split(document);
            log.info("Split document into {} chunks", segments.size());

            if (segments.isEmpty()) {
                log.warn("Document has no content to index: {}", doc.getFilename());
                return new EmbeddingResult(0, null);
            }

            List<TextSegment> segmentsWithMetadata = new ArrayList<>();
            Map<String, Object> documentMetadata = new HashMap<>();
            
            for (int i = 0; i < segments.size(); i++) {
                TextSegment segment = segments.get(i);

                Map<String, String> metadata = new HashMap<>();
                metadata.put(METADATA_DOCUMENT_ID, doc.getId());
                metadata.put(METADATA_FILENAME, doc.getFilename());
                metadata.put(METADATA_FILE_TYPE, doc.getFileType());
                metadata.put(METADATA_CHUNK_INDEX, String.valueOf(i));
                metadata.put(METADATA_TOTAL_CHUNKS, String.valueOf(segments.size()));

                // Store chunk metadata
                documentMetadata.put("chunk_" + i, Map.of(
                    "index", i,
                    "length", segment.text().length(),
                    "preview", segment.text().substring(0, Math.min(100, segment.text().length()))
                ));

                TextSegment segmentWithMetadata = TextSegment.from(
                        segment.text(),
                        new Metadata(metadata)
                );

                segmentsWithMetadata.add(segmentWithMetadata);
            }

            List<Embedding> embeddings = embeddingModel.embedAll(segmentsWithMetadata).content();
            log.debug("Created {} embeddings", embeddings.size());

            embeddingStore.addAll(embeddings, segmentsWithMetadata);

            log.info("Completed indexing file: {} with {} chunks", doc.getFilename(), segments.size());

            return new EmbeddingResult(segments.size(), documentMetadata);

        } catch (IOException e) {
            log.error("IO error indexing file {}: {}", doc.getFilename(), e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Error indexing file {}: {}", doc.getFilename(), e.getMessage(), e);
            throw new RuntimeException("Cannot index file: " + e.getMessage(), e);
        }
    }

    /**
     * Update embeddings for file (delete old and create new)
     */
    public EmbeddingResult reindexFile(com.aurora.backend.entity.Document doc, byte[] fileBytes) throws IOException {
        log.info("Starting to reindex file: {} (ID: {})", doc.getFilename(), doc.getId());

        try {
            deleteFileEmbeddings(doc.getId());

            EmbeddingResult result = indexFile(doc, fileBytes);

            log.info("Completed reindexing file: {}", doc.getFilename());
            
            return result;
        } catch (Exception e) {
            log.error("Error reindexing file {}: {}", doc.getFilename(), e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Check if file has been indexed
     */
    public boolean isFileIndexed(String fileId) {
        try {
            List<String> embeddingIds = findEmbeddingIdsByFileId(fileId);
            boolean indexed = !embeddingIds.isEmpty();
            log.debug("File ID {} {} indexed", fileId, indexed ? "is" : "is not");
            return indexed;
        } catch (Exception e) {
            log.error("Error checking index status for file {}: {}", fileId, e.getMessage());
            return false;
        }
    }

    private List<String> findEmbeddingIdsByFileId(String fileId) {
        List<String> embeddingIds = new ArrayList<>();

        try {
            // With InMemoryEmbeddingStore or PgVector, we can search with filter
            // Search with a dummy query to get all results with matching metadata
            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(embeddingModel.embed("dummy").content())
                    .maxResults(1000)
                    .minScore(0.0)
                    .build();

            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);

            for (EmbeddingMatch<TextSegment> match : searchResult.matches()) {
                TextSegment segment = match.embedded();
                if (segment != null && segment.metadata() != null) {
                    String docId = segment.metadata().getString(METADATA_DOCUMENT_ID);
                    if (docId != null && docId.equals(fileId)) {
                        embeddingIds.add(match.embeddingId());
                    }
                }
            }

        } catch (Exception e) {
            log.warn("Cannot find embeddings by metadata, using fallback method: {}", e.getMessage());
            // Fallback: if store doesn't support search, return empty list
        }

        return embeddingIds;
    }

    public FileIndexInfo getFileIndexInfo(String fileId) {
        List<String> embeddingIds = findEmbeddingIdsByFileId(fileId);

        if (embeddingIds.isEmpty()) {
            return new FileIndexInfo(fileId, false, 0, null);
        }

        try {
            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(embeddingModel.embed("dummy").content())
                    .maxResults(1)
                    .minScore(0.0)
                    .build();

            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);

            for (EmbeddingMatch<TextSegment> match : searchResult.matches()) {
                TextSegment segment = match.embedded();
                if (segment != null && segment.metadata() != null) {
                    String docId = segment.metadata().getString(METADATA_DOCUMENT_ID);
                    if (docId != null && docId.equals(fileId)) {
                        String filename = segment.metadata().getString(METADATA_FILENAME);
                        return new FileIndexInfo(fileId, true, embeddingIds.size(), filename);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error getting index info: {}", e.getMessage());
        }

        return new FileIndexInfo(fileId, true, embeddingIds.size(), null);
    }

    /**
     * Class containing file index status information
     */
    @Data
    @AllArgsConstructor
    public static class FileIndexInfo {
        private String fileId;
        private boolean indexed;
        private int chunkCount;
        private String filename;
    }

    /**
     * Class containing embedding result
     */
    @Data
    @AllArgsConstructor
    public static class EmbeddingResult {
        private int totalChunks;
        private Map<String, Object> metadata;
    }
}

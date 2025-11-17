package com.aurora.backend.service;

import com.aurora.backend.entity.DocumentMetadata;
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
    private final DocumentSplitter documentSplitter = DocumentSplitters.recursive(1000, 200);

    /**
     * Xóa embeddings của file khỏi vector store
     */
    public void deleteFileEmbeddings(Long fileId) {
        try {
            log.info("Bắt đầu xóa embeddings của file ID: {}", fileId);

            // Tìm tất cả embeddings của file này
            List<String> embeddingIds = findEmbeddingIdsByFileId(fileId);

            if (embeddingIds.isEmpty()) {
                log.warn("Không tìm thấy embeddings nào cho file ID: {}", fileId);
                return;
            }

            // Xóa từng embedding
            for (String embeddingId : embeddingIds) {
                embeddingStore.remove(embeddingId);
            }

            log.info("Đã xóa {} embeddings của file ID: {}", embeddingIds.size(), fileId);
        } catch (Exception e) {
            log.error("Lỗi khi xóa embeddings của file ID {}: {}", fileId, e.getMessage(), e);
            throw new RuntimeException("Không thể xóa embeddings: " + e.getMessage(), e);
        }
    }

    /**
     * Tạo embeddings cho file và lưu vào vector store
     */
    public void indexFile(DocumentMetadata meta) throws IOException {
        try {
            log.info("Bắt đầu index file: {} (ID: {})", meta.getFilename(), meta.getId());

            // Kiểm tra xem file content có tồn tại không
            if (meta.getFileContent() == null || meta.getFileContent().getContent() == null) {
                throw new IOException("File content không tồn tại trong database");
            }

            // Đọc và parse document từ byte array
            byte[] fileBytes = meta.getFileContent().getContent();
            Document document = documentParser.parse(new java.io.ByteArrayInputStream(fileBytes));
            log.debug("Đã parse document, độ dài: {} ký tự", document.text().length());

            // Split document thành các chunks
            List<TextSegment> segments = documentSplitter.split(document);
            log.info("Đã chia document thành {} chunks", segments.size());

            if (segments.isEmpty()) {
                log.warn("Document không có nội dung để index: {}", meta.getFilename());
                return;
            }

            // Tạo metadata cho từng chunk
            List<TextSegment> segmentsWithMetadata = new ArrayList<>();
            for (int i = 0; i < segments.size(); i++) {
                TextSegment segment = segments.get(i);

                // Thêm metadata vào segment
                Map<String, String> metadata = new HashMap<>();
                metadata.put(METADATA_DOCUMENT_ID, meta.getId().toString());
                metadata.put(METADATA_FILENAME, meta.getFilename());
                metadata.put(METADATA_FILE_TYPE, meta.getFileType());
                metadata.put(METADATA_CHUNK_INDEX, String.valueOf(i));
                metadata.put(METADATA_TOTAL_CHUNKS, String.valueOf(segments.size()));

                TextSegment segmentWithMetadata = TextSegment.from(
                        segment.text(),
                        new Metadata(metadata)
                );

                segmentsWithMetadata.add(segmentWithMetadata);
            }

            // Tạo embeddings và lưu vào store
            List<Embedding> embeddings = embeddingModel.embedAll(segmentsWithMetadata).content();
            log.debug("Đã tạo {} embeddings", embeddings.size());

            // Lưu embeddings kèm theo text segments vào store
            embeddingStore.addAll(embeddings, segmentsWithMetadata);

            log.info("Hoàn thành index file: {} với {} chunks", meta.getFilename(), segments.size());

        } catch (IOException e) {
            log.error("Lỗi IO khi index file {}: {}", meta.getFilename(), e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi index file {}: {}", meta.getFilename(), e.getMessage(), e);
            throw new RuntimeException("Không thể index file: " + e.getMessage(), e);
        }
    }

    /**
     * Cập nhật embeddings cho file (xóa cũ và tạo mới)
     */
    public void reindexFile(DocumentMetadata meta) throws IOException {
        log.info("Bắt đầu reindex file: {} (ID: {})", meta.getFilename(), meta.getId());

        try {
            // Xóa embeddings cũ nếu có
            deleteFileEmbeddings(meta.getId());

            // Tạo embeddings mới
            indexFile(meta);

            log.info("Hoàn thành reindex file: {}", meta.getFilename());
        } catch (Exception e) {
            log.error("Lỗi khi reindex file {}: {}", meta.getFilename(), e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Kiểm tra xem file đã được index chưa
     */
    public boolean isFileIndexed(Long fileId) {
        try {
            List<String> embeddingIds = findEmbeddingIdsByFileId(fileId);
            boolean indexed = !embeddingIds.isEmpty();
            log.debug("File ID {} {} được index", fileId, indexed ? "đã" : "chưa");
            return indexed;
        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra index status của file {}: {}", fileId, e.getMessage());
            return false;
        }
    }

    private List<String> findEmbeddingIdsByFileId(Long fileId) {
        List<String> embeddingIds = new ArrayList<>();

        try {
            // Với InMemoryEmbeddingStore hoặc PgVector, ta có thể search với filter
            // Tìm kiếm với một query giả để lấy tất cả kết quả có metadata khớp
            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(embeddingModel.embed("dummy").content()) // Embedding giả
                    .maxResults(1000) // Số lượng tối đa
                    .minScore(0.0) // Không filter theo score
                    .build();

            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);

            // Filter kết quả theo documentId trong metadata
            for (EmbeddingMatch<TextSegment> match : searchResult.matches()) {
                TextSegment segment = match.embedded();
                if (segment != null && segment.metadata() != null) {
                    String docId = segment.metadata().getString(METADATA_DOCUMENT_ID);
                    if (docId != null && docId.equals(fileId.toString())) {
                        embeddingIds.add(match.embeddingId());
                    }
                }
            }

        } catch (Exception e) {
            log.warn("Không thể tìm embeddings theo metadata, sử dụng phương pháp fallback: {}", e.getMessage());
            // Fallback: nếu store không hỗ trợ search, trả về empty list
        }

        return embeddingIds;
    }

    public FileIndexInfo getFileIndexInfo(Long fileId) {
        List<String> embeddingIds = findEmbeddingIdsByFileId(fileId);

        if (embeddingIds.isEmpty()) {
            return new FileIndexInfo(fileId, false, 0, null);
        }

        // Lấy thông tin từ chunk đầu tiên
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
                    if (docId != null && docId.equals(fileId.toString())) {
                        String filename = segment.metadata().getString(METADATA_FILENAME);
                        return new FileIndexInfo(fileId, true, embeddingIds.size(), filename);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin index: {}", e.getMessage());
        }

        return new FileIndexInfo(fileId, true, embeddingIds.size(), null);
    }

    /**
     * Class chứa thông tin về trạng thái index của file
     */
    @Data
    @AllArgsConstructor
    public static class FileIndexInfo {
        private Long fileId;
        private boolean indexed;
        private int chunkCount;
        private String filename;
    }
}

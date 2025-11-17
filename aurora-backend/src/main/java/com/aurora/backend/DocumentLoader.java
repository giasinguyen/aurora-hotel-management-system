package com.aurora.backend;

import com.aurora.backend.service.DocumentService;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentParser;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.apache.tika.ApacheTikaDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.googleai.GoogleAiEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class DocumentLoader implements CommandLineRunner {

    private final EmbeddingStore<TextSegment> embeddingStore;
    private final DocumentService documentService;
    private final GoogleAiEmbeddingModel embeddingModel;

    @Override
    public void run(String... args) throws Exception {
        if (!documentService.listFiles().isEmpty()) {
            System.out.println("Document already loaded.");
            return;
        }

        Path docsPath = Paths.get("src/main/resources/docs");

        if (!Files.exists(docsPath)) {
            System.out.println("Documents directory does not exist: " + docsPath);
            return;
        }

        DocumentParser documentParser = new ApacheTikaDocumentParser();
        DocumentSplitter splitter = DocumentSplitters.recursive(1000, 300);


        try (Stream<Path> paths = Files.walk(docsPath)) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> !path.getFileName().toString().startsWith("."))
                    .forEach(filePath -> {
                        try {
                            Document document = FileSystemDocumentLoader.loadDocument(filePath, documentParser);
                            List<TextSegment> segments = splitter.split(document);
                            List<Embedding> embeddings = embeddingModel.embedAll(segments).content();
                            embeddingStore.addAll(embeddings, segments);
                            System.out.println("Processed: " + filePath.getFileName());
                        } catch (Exception e) {
                            System.err.println("Error processing file " + filePath + ": " + e.getMessage());
                        }
                    });
        }
    }
}

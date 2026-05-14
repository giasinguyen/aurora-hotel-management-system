package com.aurora.backend.config;

import com.aurora.backend.service.RagService;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiStreamingChatModel;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class RagConfig {
    @Value("${langchain4j.google-ai-gemini.embedding-model.output-dimensionality:768}")
    private int outputDimension;

    @Value("${rag.retriever.max-results:8}")
    private int retrieverMaxResults;

    @Value("${rag.retriever.min-score:0.25}")
    private double retrieverMinScore;

    @Bean
    public RagService geminiRagService(
            ContentRetriever contentRetriever,
            GoogleAiGeminiChatModel googleAiGeminiChatModel,
            GoogleAiGeminiStreamingChatModel googleAiGeminiStreamingChatModel,
            ChatMemoryProvider chatMemoryProvider
    ) {
        return AiServices.builder(RagService.class)
                .chatModel(googleAiGeminiChatModel)
                .streamingChatModel(googleAiGeminiStreamingChatModel)
                .chatMemoryProvider(chatMemoryProvider)
                .contentRetriever(contentRetriever)
                .build();
    }

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore(DataSourceProperties properties, DataSourceProperties dataSourceProperties) {
        String jdbcUrl = dataSourceProperties.getUrl();

        String cleanUrl = jdbcUrl.replace("jdbc:postgresql://", "").split("\\?")[0];
        String[] parts = cleanUrl.split("/");
        String[] hostPort = parts[0].split(":");

        String host = hostPort[0];
        int port = hostPort.length > 1 ? Integer.parseInt(hostPort[1]) : 5432;
        String database = parts[1];

        return PgVectorEmbeddingStore
                .builder()
                .host(host)
                .port(port)
                .database(database)
                .user(dataSourceProperties.getUsername())
                .password(dataSourceProperties.getPassword())
                .table("langchain_store")
                .dropTableFirst(false)
                .createTable(true)
                .dimension(outputDimension)
                .build();
    }

    @Bean
    public ContentRetriever contentRetriever(EmbeddingStore<TextSegment> embeddingStore, EmbeddingModel embeddingModel) {
        ContentRetriever retriever = EmbeddingStoreContentRetriever
                .builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(retrieverMaxResults)
                .minScore(retrieverMinScore)
                .build();

        return query -> {
            List<Content> contents = retriever.retrieve(query);
            log.info(
                    "RAG retrieved {} chunks for query '{}' (maxResults={}, minScore={})",
                    contents.size(),
                    query.text(),
                    retrieverMaxResults,
                    retrieverMinScore
            );
            contents.stream()
                    .limit(3)
                    .forEach(content -> log.debug("RAG chunk preview: {}", preview(content)));
            return contents;
        };
    }

    @Bean
    public ChatMemoryProvider chatMemoryProvider() {
        return memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(10)
                .build();
    }

    private String preview(Content content) {
        if (content == null || content.textSegment() == null || content.textSegment().text() == null) {
            return "";
        }

        String text = content.textSegment().text().replaceAll("\\s+", " ").trim();
        return text.substring(0, Math.min(200, text.length()));
    }
}

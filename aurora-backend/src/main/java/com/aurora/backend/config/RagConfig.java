package com.aurora.backend.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RagConfig {

    @Value("${langchain4j.google-ai-gemini.embedding-model.output-dimensionality:768}")
    private int outputDimension;

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
        return EmbeddingStoreContentRetriever
                .builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .minScore(0.7)
                .build();
    }

    @Bean
    public ChatMemoryProvider chatMemoryProvider() {
        return memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(10)
                .build();
    }
}

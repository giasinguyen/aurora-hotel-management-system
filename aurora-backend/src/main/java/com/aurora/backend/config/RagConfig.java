package com.aurora.backend.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RagConfig {
    @Value("${spring.datasource.username:admin}")
    private String dbUsername;

    @Value("${spring.datasource.password:admin}")
    private String dbPassword;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${langchain4j.google-ai-gemini.embedding-model.output-dimensionality:768}")
    private int outputDimension;

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        String url = dbUrl.replace("jdbc:postgresql://", "");
        String[] urlParts = url.split("/");
        String hostAndPort = urlParts[0];
        String database = urlParts[1];

        String[] hostPortParts = hostAndPort.split(":");
        String host = hostPortParts[0];
        int port = hostPortParts.length > 1 ? Integer.parseInt(hostPortParts[1]) : 5432;

        return PgVectorEmbeddingStore
                .builder()
                .host(host)
                .database(database)
                .port(port)
                .user(dbUsername)
                .password(dbPassword)
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

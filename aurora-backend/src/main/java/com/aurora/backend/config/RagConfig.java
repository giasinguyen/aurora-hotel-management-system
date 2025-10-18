package com.aurora.backend.config;

import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.reader.ExtractedTextFormatter;
import org.springframework.ai.reader.pdf.config.PdfDocumentReaderConfig;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class RagConfig {
    @Value("${document.processing.chunk-size:1000}")
    private int chunkSize;

    @Value("${document.processing.chunk-overlap:200}")
    private int chunkOverlap;

    @Value("classpath:/prompt/rag-prompt.st")
    private Resource ragPromptTemplate;

    @Bean
    public QuestionAnswerAdvisor questionAnswerAdvisor(VectorStore vectorStore) {
        PromptTemplate promptTemplate = new PromptTemplate(ragPromptTemplate);
        SearchRequest searchRequest = SearchRequest
                .builder()
                .topK(5)
                .similarityThreshold(0.7)
                .build();
        return QuestionAnswerAdvisor
                .builder(vectorStore)
                .searchRequest(searchRequest)
                .promptTemplate(promptTemplate)
                .build();
    }

    @Bean
    public PdfDocumentReaderConfig pdfDocumentReaderConfig() {
        return PdfDocumentReaderConfig
                .builder()
                .withPageExtractedTextFormatter(ExtractedTextFormatter.builder()
                        .withLeftAlignment(true)
                        .build())
                .build();
    }

    @Bean
    public TokenTextSplitter tokenTextSplitter() {
        return new TokenTextSplitter(chunkSize, chunkOverlap, 5, 10000, true);
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}

package com.aurora.backend.config;

import com.aurora.backend.service.GeminiService;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class GeminiConfig {


    @Bean
    public GeminiService geminiRagService(ContentRetriever contentRetriever, GoogleAiGeminiChatModel googleAiGeminiChatModel) {
        return AiServices.builder(GeminiService.class)
                .chatModel(googleAiGeminiChatModel)
                .contentRetriever(contentRetriever)
                .build();
    }
}

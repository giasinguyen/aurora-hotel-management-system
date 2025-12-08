package com.aurora.backend.controller;

import com.aurora.backend.service.RagService;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/rag")
@RequiredArgsConstructor
public class RagController {
    private final RagService geminiRagService;
    private final ContentRetriever contentRetriever;

    @Deprecated
    @GetMapping("/sync")
    public String chat(@RequestParam String message, @RequestParam(required = false) String chatId) {
        return geminiRagService.chat(chatId, message);
    }

    @Deprecated
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> stream(@RequestParam String message, @RequestParam(required = false) String chatId) {
        return geminiRagService.stream(chatId, message)
                .filter(chunk -> chunk != null && !chunk.trim().isEmpty())
                .map(chunk -> "data: " + chunk + "\n\n")
                .doOnComplete(() -> log.info("Stream completed for chatId: {}", chatId))
                .doOnError(error -> log.error("Streaming error: {}", error.getMessage()));
    }

    @GetMapping("/retriever")
    public String testRetriever(@RequestParam(required = false, defaultValue = "aurora có ưu đãi gì?") String message) {
        List<Content> contents = contentRetriever.retrieve(Query.from(message));
        return contents.toString();
    }
}


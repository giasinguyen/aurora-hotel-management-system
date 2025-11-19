package com.aurora.backend.controller;

import com.aurora.backend.service.GeminiService;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rag")
@RequiredArgsConstructor
public class RagController {

    private final GeminiService geminiRagService;
    private final ContentRetriever contentRetriever;

    @GetMapping("/sync")
    public String chat(@RequestParam String message, @RequestParam(required = false) String chatId) {
        return geminiRagService.chat(chatId, message);
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> stream(@RequestParam(defaultValue = "dịch vụ của khách sạn aurora") String message,
                               @RequestParam(required = false, defaultValue = "1") String chatId
    ) {

        return geminiRagService.stream(chatId, message)
                .map(chunk -> {
                    if (chunk == null || chunk.trim().isEmpty()) {
                        return "data: \n\n";
                    }
                    return "data: " + chunk.replace("\n", "\\n") + "\n\n";
                })
                .doOnComplete(() -> {
                    // Send close event when stream completes
                })
                .doOnError(error -> {
                    System.err.println("Streaming error: " + error.getMessage());
                });
    }

    @GetMapping("/retriever")
    public String testRetriever(@RequestParam(required = false, defaultValue = "aurora có ưu đãi gì?") String message) {
        List<Content> contents = contentRetriever.retrieve(Query.from(message));
        return contents.toString();
    }
}


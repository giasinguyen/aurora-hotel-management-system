package com.aurora.backend.controller;

import com.aurora.backend.service.AssistantService;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rag")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RagController {
    AssistantService assistantService;
    ContentRetriever contentRetriever;

    @GetMapping("/sync")
    public String generateSync(@RequestParam String message, @RequestParam(required = false) String chatId) {
        return assistantService.chat(chatId, message);
    }

    @GetMapping("/retriever")
    public String retriever(@RequestParam(defaultValue = "aurora có ưu đãi gì?") String message) {
        List<Content> contents = contentRetriever.retrieve(Query.from(message));
        return contents.toString();
    }
}

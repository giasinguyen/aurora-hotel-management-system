package com.aurora.backend.socket;

import com.aurora.backend.service.RagService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import reactor.core.Disposable;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiStreamWebSocketHandler implements WebSocketHandler {

    private static final String DEFAULT_CHAT_ID = "1";

    private final RagService geminiRagService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Disposable> subscriptions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("WebSocket connected: {}", session.getId());
        sendMessage(session, Map.of(
                "type", "connection",
                "status", "connected",
                "sessionId", session.getId()
        ));
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        if (!(message instanceof TextMessage textMessage)) {
            return;
        }

        String payload = textMessage.getPayload();
        log.info("Received message: {}", payload);

        ChatRequest request;
        try {
            request = parseRequest(payload);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid WebSocket message payload: {}", e.getMessage());
            sendMessage(session, Map.of(
                    "type", "error",
                    "message", e.getMessage()
            ));
            return;
        } catch (Exception e) {
            log.warn("Unable to parse WebSocket message payload: {}", e.getMessage());
            sendMessage(session, Map.of(
                    "type", "error",
                    "message", "Tin nhan gui len khong dung dinh dang"
            ));
            return;
        }

        // Cancel any previous stream for this WebSocket session.
        Disposable oldSubscription = subscriptions.remove(session.getId());
        if (oldSubscription != null && !oldSubscription.isDisposed()) {
            oldSubscription.dispose();
        }

        try {
            Disposable subscription = geminiRagService.stream(request.chatId(), request.message())
                    .doOnNext(chunk -> {
                        try {
                            if (chunk != null && !chunk.trim().isEmpty()) {
                                sendMessage(session, Map.of(
                                        "type", "chunk",
                                        "data", chunk
                                ));
                            }
                        } catch (Exception e) {
                            log.error("Error sending chunk: {}", e.getMessage());
                        }
                    })
                    .doOnComplete(() -> {
                        try {
                            sendMessage(session, Map.of(
                                    "type", "complete",
                                    "status", "finished"
                            ));
                            subscriptions.remove(session.getId());
                        } catch (Exception e) {
                            log.error("Error sending completion: {}", e.getMessage());
                        }
                    })
                    .doOnError(error -> {
                        try {
                            log.error("Streaming error: {}", error.getMessage());
                            sendMessage(session, Map.of(
                                    "type", "error",
                                    "message", error.getMessage()
                            ));
                            subscriptions.remove(session.getId());
                        } catch (Exception e) {
                            log.error("Error sending error message: {}", e.getMessage());
                        }
                    })
                    .subscribe();

            subscriptions.put(session.getId(), subscription);
        } catch (Exception e) {
            log.error("Error starting stream: {}", e.getMessage(), e);
            sendMessage(session, Map.of(
                    "type", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("Transport error for session {}: {}", session.getId(), exception.getMessage());
        cleanupSession(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        log.info("WebSocket disconnected: {} - Status: {}", session.getId(), closeStatus);
        cleanupSession(session);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    private ChatRequest parseRequest(String payload) throws IOException {
        if (payload == null || payload.trim().isEmpty()) {
            throw new IllegalArgumentException("Vui long nhap noi dung tin nhan");
        }

        String trimmedPayload = payload.trim();
        if (!trimmedPayload.startsWith("{")) {
            return new ChatRequest(DEFAULT_CHAT_ID, trimmedPayload);
        }

        JsonNode root = objectMapper.readTree(trimmedPayload);
        if (root == null || !root.isObject()) {
            throw new IllegalArgumentException("Tin nhan gui len khong dung dinh dang");
        }

        String userMessage = getText(root, "message");
        if (userMessage == null) {
            userMessage = getText(root, "content");
        }
        if (userMessage == null || userMessage.isBlank()) {
            throw new IllegalArgumentException("Vui long nhap noi dung tin nhan");
        }

        String chatId = getText(root, "chatId");
        if (chatId == null || chatId.isBlank()) {
            chatId = DEFAULT_CHAT_ID;
        }

        return new ChatRequest(chatId, userMessage.trim());
    }

    private String getText(JsonNode root, String fieldName) {
        JsonNode value = root.get(fieldName);
        return value != null && value.isTextual() ? value.asText() : null;
    }

    private void sendMessage(WebSocketSession session, Map<String, Object> data) throws IOException {
        if (session.isOpen()) {
            String json = objectMapper.writeValueAsString(data);
            session.sendMessage(new TextMessage(json));
        }
    }

    private void cleanupSession(WebSocketSession session) {
        Disposable subscription = subscriptions.remove(session.getId());
        if (subscription != null && !subscription.isDisposed()) {
            subscription.dispose();
        }
    }

    private record ChatRequest(String chatId, String message) {
    }
}

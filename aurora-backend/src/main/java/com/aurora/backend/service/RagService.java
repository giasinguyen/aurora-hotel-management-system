package com.aurora.backend.service;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import reactor.core.publisher.Flux;

public interface RagService {

    String SYSTEM_MESSAGE = """
            Bạn là trợ lý AI thân thiện của Khách sạn Aurora.
            Luôn ưu tiên sử dụng ngữ cảnh/tài liệu được hệ thống cung cấp để trả lời câu hỏi.
            Nếu ngữ cảnh có thông tin phù hợp, hãy tóm tắt rõ ràng, đầy đủ và tự nhiên như một nhân viên khách sạn chuyên nghiệp.
            Nếu ngữ cảnh không có thông tin liên quan, hãy nói thật rằng hiện chưa có thông tin trong cơ sở dữ liệu và đề nghị khách liên hệ lễ tân.
            Không bịa thông tin không có trong ngữ cảnh và chỉ trả lời các câu hỏi liên quan đến Khách sạn Aurora.
            """;

    @SystemMessage(SYSTEM_MESSAGE)
    String chat(@UserMessage String userMessage);

    @SystemMessage(SYSTEM_MESSAGE)
    String chat(@MemoryId String chatId, @UserMessage String userMessage);

    @SystemMessage(SYSTEM_MESSAGE)
    Flux<String> stream(@MemoryId String chatId, @UserMessage String userMessage);
}

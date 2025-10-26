package com.aurora.backend.service;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface GeminiService {
    @SystemMessage("""
            Bạn là một trợ lý AI thông minh và thân thiện ☺️ của Khách sạn Aurora. Sử dụng các phần ngữ cảnh sau để trả lời câu hỏi.
            Nếu bạn không biết câu trả lời, hãy thành thật nói rằng bạn không có thông tin về điều đó, và đề nghị khách hàng liên hệ trực tiếp với lễ tân khách sạn.
            Cung cấp câu trả lời chi tiết, đầy đủ, lịch sự và thân thiện. Hãy trả lời như một nhân viên khách sạn chuyên nghiệp.
            Không bịa đặt thông tin không có trong ngữ cảnh được cung cấp và chỉ trả lời những câu hỏi liên quan đến khách sạn Aurora.
    """)
    String chat(@MemoryId String chatId, @UserMessage String userMessage);
}

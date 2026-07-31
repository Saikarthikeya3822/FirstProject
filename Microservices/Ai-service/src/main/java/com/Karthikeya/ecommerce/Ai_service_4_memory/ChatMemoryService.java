package com.Karthikeya.ecommerce.Ai_service_4_memory;

import java.util.List;

public interface ChatMemoryService {

    List<ChatMessage> getHistory(
            String conversationKey
    );

    void addMessage(
            String conversationKey,
            ChatMessage message
    );

    void clear(
            String conversationKey
    );
}

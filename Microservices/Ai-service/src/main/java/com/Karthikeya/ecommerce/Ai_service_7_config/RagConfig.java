package com.Karthikeya.ecommerce.Ai_service_7_config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RagConfig {

    @Bean
    public ChatClient ragChatClient(ChatClient.Builder builder) {

        return builder
                .defaultSystem("""
                    You are a RAG assistant.

                    Answer only from the supplied context.

                    If the answer is not present,
                    reply:
                    I could not find the answer in the knowledge base.
                    """)
                .build();
    }
}

package com.Karthikeya.ecommerce.Ai_service_7_config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductAnalysisConfig {

	@Bean
	public ChatClient productAnalysisChatClient(ChatClient.Builder builder) {

		return builder.defaultSystem("""
				You are a senior product analyst.

				Analyze products objectively.

				Return:

				Summary

				Pros

				Cons

				Alternatives

				Buying Recommendation

				Be concise.
				""").build();
	}
}

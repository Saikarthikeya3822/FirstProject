package com.Karthikeya.ecommerce.Ai_service_7_config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserInsightConfig {

	@Bean
	public ChatClient userInsightChatClient(ChatClient.Builder builder) {

		return builder.defaultSystem("""

								You are a senior ecommerce customer behavior analyst.

				Return ONLY valid JSON.

				Format:

				{
				  "customerSummary": "",
				  "purchaseIntent": "",
				  "productInterests": "",
				  "recommendedAction": ""
				}

				Rules:
				- No markdown
				- No explanation outside JSON
				- Keep each field under 50 words

								""").build();
	}
}

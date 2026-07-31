package com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_2_Model.UserAnalyticsResponse;
import com.Karthikeya.ecommerce.Ai_service_2_Model.UserInsightResponse;
import com.Karthikeya.ecommerce.Ai_service_6_external_clients.UserAnalyticsClient;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserInsightServiceImpl implements UserInsightService {

	@Autowired
	@Qualifier("userInsightChatClient")
	private ChatClient userInsightChatClient;

	@Autowired
	private UserAnalyticsClient analyticsClient;

	@Autowired
	private ObjectMapper objectMapper;

	@Override
	public UserInsightResponse generateInsights(String userId, String token) {

		UserAnalyticsResponse analytics = analyticsClient.getUserAnalytics(userId, 90, token);
		String prompt = buildPrompt(analytics);
		String aiResponse = userInsightChatClient.prompt().user(prompt).call().content();

		try {

			return objectMapper.readValue(aiResponse, UserInsightResponse.class);

		} catch (Exception e) {

			throw new RuntimeException("Failed to parse AI response", e);
		}
	}

	private String buildPrompt(UserAnalyticsResponse analytics) {

		return """
				Analyze this customer's shopping behavior.

				Total Views: %d

				Total Cart Adds: %d

				Total Purchases: %d

				Conversion Rate: %.2f%%

				Favorite Category: %s

				Most Purchased Category: %s

				Most Viewed Product: %s

				Provide:

				1. Customer Summary
				2. Purchase Intent
				3. Product Interests
				4. Recommended Action

				Keep response under 150 words.
				""".formatted(analytics.getTotalViews(), analytics.getTotalCartAdds(), analytics.getTotalPurchases(),
				analytics.getConversionRate(), analytics.getMostViewedCategory(), analytics.getMostPurchasedCategory(),
				analytics.getMostViewedProduct() != null ? analytics.getMostViewedProduct().getProductName() : "N/A");
	}
}

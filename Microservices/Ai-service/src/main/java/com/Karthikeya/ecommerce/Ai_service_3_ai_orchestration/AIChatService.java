package com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_2_Model.AIChatRequest;
import com.Karthikeya.ecommerce.Ai_service_2_Model.AIResponse;
import com.Karthikeya.ecommerce.Ai_service_4_memory.ChatMemoryService;
import com.Karthikeya.ecommerce.Ai_service_4_memory.ChatMessage;
import com.Karthikeya.ecommerce.Ai_service_5_Tools.AIOrderTool;
import com.Karthikeya.ecommerce.Ai_service_5_Tools.AIProductTool;
import com.Karthikeya.ecommerce.Ai_service_8_util.SecurityUtil;

@Service
public class AIChatService {

	private final ChatClient chatClient;

	private final ChatMemoryService chatMemoryService;
	private final AIProductTool aiProductTool;

	private final AIOrderTool aiOrderTool;

	@Autowired
	private ConversationService conversationService;
	private static final Logger logger = LoggerFactory.getLogger(AIChatService.class);

	public AIChatService(

			ChatClient chatClient,

			ChatMemoryService chatMemoryService,

			AIProductTool aiProductTool,

			AIOrderTool aiOrderTool) {

		this.chatClient = chatClient;

		this.chatMemoryService = chatMemoryService;

		this.aiProductTool = aiProductTool;

		this.aiOrderTool = aiOrderTool;
	}

	public AIResponse chat(AIChatRequest request, String token) {

		aiProductTool.setToken(token);
		aiOrderTool.setToken(token);

		String userId = SecurityUtil.getUserIdFromToken(token);

		String conversationKey = userId + ":" + request.getConversationId();

		// Save conversation metadata
		// This will save only once for a conversation

		conversationService.saveConversationMetadata(userId, request.getConversationId(), request.getMessage());

		List<ChatMessage> history = chatMemoryService.getHistory(conversationKey);

		StringBuilder contextBuilder = new StringBuilder();

		for (ChatMessage message : history) {

			contextBuilder.append(message.getRole()).append(": ").append(message.getContent()).append("\n");
		}

		contextBuilder.append("user: ").append(request.getMessage());

		// Save user message

		chatMemoryService.addMessage(conversationKey, new ChatMessage("user", request.getMessage()));

		try {

			AIResponse response = chatClient.prompt().user(contextBuilder.toString()).call().entity(AIResponse.class);

			logger.info("Summary: {}", response.getSummary());

			String assistantContent = response.getSummary();

			if (assistantContent == null || assistantContent.isBlank()) {

				assistantContent = response.getRecommendationReason();

				if (assistantContent == null) {
					assistantContent = "Response generated successfully";
				}
			}

			// Save complete AI response

			chatMemoryService.addMessage(conversationKey, new ChatMessage("assistant", assistantContent, response));

			return response;

		} catch (NonTransientAiException e) {

			AIResponse errorResponse = new AIResponse();

			errorResponse.setSummary("AI quota exceeded. Please try again later.");

			return errorResponse;
		}
	}

	public List<ChatMessage> getChatHistory(

			String conversationId,

			String token) {

		String userId = SecurityUtil.getUserIdFromToken(token);

		String conversationKey = userId + ":" + conversationId;

		return chatMemoryService.getHistory(conversationKey);
	}
}
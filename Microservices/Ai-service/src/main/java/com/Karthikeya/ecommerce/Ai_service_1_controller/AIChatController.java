package com.Karthikeya.ecommerce.Ai_service_1_controller;

import java.util.List;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.Karthikeya.ecommerce.Ai_service_2_Model.AIChatRequest;
import com.Karthikeya.ecommerce.Ai_service_2_Model.AIErrorResponse;
import com.Karthikeya.ecommerce.Ai_service_2_Model.AIResponse;
import com.Karthikeya.ecommerce.Ai_service_2_Model.ConversationMetadata;
import com.Karthikeya.ecommerce.Ai_service_2_Model.ProductAnalysisResponse;
import com.Karthikeya.ecommerce.Ai_service_2_Model.ProductComparisonRequest;
import com.Karthikeya.ecommerce.Ai_service_2_Model.ProductComparisonResponse;
import com.Karthikeya.ecommerce.Ai_service_2_Model.UserInsightResponse;
import com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration.AIChatService;
import com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration.ConversationService;
import com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration.ProductAnalysisService;
import com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration.UserInsightService;
import com.Karthikeya.ecommerce.Ai_service_4_memory.ChatMessage;
import com.Karthikeya.ecommerce.Ai_service_8_util.SecurityUtil;

@RestController
@RequestMapping("/springai")
public class AIChatController {

	private final AIChatService aiChatService;

	public AIChatController(AIChatService aiChatService) {

		this.aiChatService = aiChatService;
	}

	@Autowired
	private ConversationService conversationService;
	@Autowired
	private UserInsightService userInsightService;

	@PostMapping("/chat")
	public AIResponse chat(

			@RequestBody AIChatRequest request,

			@RequestHeader("Authorization") String token) {

		return aiChatService.chat(request, token);
	}

	@GetMapping("/chat/history/{conversationId}")
	public List<ChatMessage> getChatHistory(

			@PathVariable String conversationId,

			@RequestHeader("Authorization") String token) {

		return aiChatService.getChatHistory(conversationId, token);
	}

	@GetMapping("/chat/conversations")
	public List<ConversationMetadata> getConversations(

			@RequestHeader("Authorization") String token) {

		String userId = SecurityUtil.getUserIdFromToken(token);

		return conversationService.getConversations(userId);
	}

	@RestController
	@RequestMapping("/db")
	public class DbTestController {

		@Autowired
		private JdbcTemplate jdbcTemplate;

		@GetMapping("/test")
		public String test() {

			return jdbcTemplate.queryForObject("select version()", String.class);
		}

		@GetMapping("/vectortest")
		public String vectorTest() {

			return jdbcTemplate.queryForObject("select extname from pg_extension where extname='vector'", String.class);
		}

		@GetMapping("/dbinfo")
		public String dbInfo() {

			return jdbcTemplate.queryForObject("select current_database()", String.class);
		}
	}

	@Autowired
	private ProductAnalysisService productAnalysisService;

	@PostMapping("/analyze-product/{id}")
	public ResponseEntity<?> analyzeProduct(@PathVariable Integer id, @RequestHeader("Authorization") String token) {
		try {
			ProductAnalysisResponse response = productAnalysisService.analyze(id, token);
			return ResponseEntity.ok(response);
		} catch (NonTransientAiException ex) {
			System.out.println("***** AI EXCEPTION CAUGHT Inside analyzeProduct *****");
			ex.printStackTrace();
			return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
					.body(new AIErrorResponse("QUOTA_EXCEEDED", "AI quota exceeded. Please try again later."));
		}

	}

	@PostMapping("/products/compare")
	public ResponseEntity<?> compareProducts(

			@RequestBody ProductComparisonRequest request) {
		try {
			ProductComparisonResponse response = productAnalysisService.compareProducts(request.getProduct1(),
					request.getProduct2());
			return ResponseEntity.ok(response);
		} catch (NonTransientAiException ex) {
			System.out.println("***** AI EXCEPTION CAUGHT Inside compareProducts *****");
			ex.printStackTrace();
			return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
					.body(new AIErrorResponse("QUOTA_EXCEEDED", "AI quota exceeded. Please try again later."));
		}
	}

	@GetMapping("/user-insights/{userId}")
	public ResponseEntity<UserInsightResponse> getUserInsights(@PathVariable String userId,@RequestHeader("Authorization") String token) {

		return ResponseEntity.ok(userInsightService.generateInsights(userId,token));
	}

}
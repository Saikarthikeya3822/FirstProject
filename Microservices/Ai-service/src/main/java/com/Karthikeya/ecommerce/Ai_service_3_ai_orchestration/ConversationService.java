package com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_2_Model.ConversationMetadata;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;

@Service
public class ConversationService {

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	@PostConstruct
	public void testObjectMapper() throws Exception {

		ConversationMetadata metadata = new ConversationMetadata();

		metadata.setConversationId("1");
		metadata.setTitle("Test");
		metadata.setLastUpdated(LocalDateTime.now());

		System.out.println(objectMapper.writeValueAsString(metadata));
	}

	public void saveConversationMetadata(String userId, String conversationId, String title) {

		String key = "conversations:" + userId;

		List<ConversationMetadata> conversations = getConversations(userId);

		boolean exists = conversations.stream().anyMatch(c -> c.getConversationId().equals(conversationId));

		if (!exists) {

			ConversationMetadata metadata = new ConversationMetadata();

			metadata.setConversationId(conversationId);

			metadata.setTitle(title.length() > 50 ? title.substring(0, 50) : title);

			metadata.setLastUpdated(LocalDateTime.now());

			conversations.add(metadata);

			String json=null;
			try {
				json = objectMapper.writeValueAsString(conversations);
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("JSON = " + json);

			System.out.println("RedisTemplate Class = " + redisTemplate.getClass());

			System.out.println("Value Serializer = " +
			        redisTemplate.getValueSerializer().getClass());

			redisTemplate.opsForValue().set(key, conversations);
		}
	}

	public List<ConversationMetadata> getConversations(String userId) {

		String key = "conversations:" + userId;

		Object value = redisTemplate.opsForValue().get(key);

		if (value == null) {
			return new ArrayList<>();
		}

		List<?> rawList = (List<?>) value;

		return new ArrayList<>(
				rawList.stream().map(item -> objectMapper.convertValue(item, ConversationMetadata.class)).toList());
	}
}

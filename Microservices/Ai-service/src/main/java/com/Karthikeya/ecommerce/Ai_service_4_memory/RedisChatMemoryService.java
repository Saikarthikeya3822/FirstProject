package com.Karthikeya.ecommerce.Ai_service_4_memory;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class RedisChatMemoryService implements ChatMemoryService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;

	public RedisChatMemoryService(RedisTemplate<String, Object> redisTemplate, ObjectMapper objectMapper) {

		this.redisTemplate = redisTemplate;
		this.objectMapper = objectMapper;
	}

	private static final String PREFIX = "chat:";

	@Override
	public List<ChatMessage> getHistory(String conversationKey) {

		String key = PREFIX + conversationKey;

		List<Object> messages = redisTemplate.opsForList().range(key, -20, -1);

		List<ChatMessage> history = new ArrayList<>();

		if (messages != null) {

			for (Object obj : messages) {

				ChatMessage msg = objectMapper.convertValue(obj, ChatMessage.class);

				history.add(objectMapper.convertValue(obj, ChatMessage.class));
			}
		}

		return history;
	}

	@Override
	public void addMessage(String conversationKey, ChatMessage message) {

		String key = PREFIX + conversationKey;

		redisTemplate.opsForList().rightPush(key, message);

		redisTemplate.expire(key, Duration.ofHours(24));
	}

	@Override
	public void clear(String conversationKey) {

		redisTemplate.delete(PREFIX + conversationKey);
	}
}

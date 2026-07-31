package com.Karthikeya.ecommerce.Ai_service_9_rag.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.Karthikeya.ecommerce.Ai_service_9_rag.Model.EmbeddingRequest;
import com.Karthikeya.ecommerce.Ai_service_9_rag.Model.EmbeddingResponse;

@Service
public class GoogleEmbeddingService {

	@Value("${google.embedding.api-key}")
	private String apiKey;

	private final WebClient webClient;

	public GoogleEmbeddingService(WebClient.Builder builder) {

		this.webClient = builder.baseUrl("https://generativelanguage.googleapis.com").build();
	}

	public List<Double> generateEmbedding(String text) {

		EmbeddingRequest request = new EmbeddingRequest(
				new EmbeddingRequest.Content(List.of(new EmbeddingRequest.Part(text))));

		EmbeddingResponse response = webClient.post().uri("/v1beta/models/gemini-embedding-001:embedContent")
				.header("x-goog-api-key", apiKey).bodyValue(request).retrieve().bodyToMono(EmbeddingResponse.class)
				.block();

		return response.getEmbedding().getValues();
	}
}

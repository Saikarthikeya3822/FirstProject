package com.Karthikeya.ecommerce.Ai_service_9_rag.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_9_rag.Model.SearchResult;

@Service
public class RagRetrievalService {

    private final GoogleEmbeddingService embeddingService;
    private final RagStorageService ragStorageService;

    public RagRetrievalService(
            GoogleEmbeddingService embeddingService,
            RagStorageService ragStorageService) {

        this.embeddingService = embeddingService;
        this.ragStorageService = ragStorageService;
    }

    public String getContext(String question) {

        List<Double> questionEmbedding =
                embeddingService.generateEmbedding(question);

        List<SearchResult> results =
                ragStorageService.search(questionEmbedding);

        StringBuilder context = new StringBuilder();

        for (SearchResult result : results) {

            context.append(result.getContent())
                   .append("\n");
        }

        return context.toString();
    }
}

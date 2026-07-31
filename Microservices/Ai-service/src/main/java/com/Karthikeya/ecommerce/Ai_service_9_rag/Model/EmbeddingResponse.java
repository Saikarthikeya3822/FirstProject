package com.Karthikeya.ecommerce.Ai_service_9_rag.Model;

import java.util.List;

public class EmbeddingResponse {

    private Embedding embedding;

    public Embedding getEmbedding() {
        return embedding;
    }

    public void setEmbedding(Embedding embedding) {
        this.embedding = embedding;
    }

    public static class Embedding {

        private List<Double> values;

        public List<Double> getValues() {
            return values;
        }

        public void setValues(List<Double> values) {
            this.values = values;
        }
    }
}

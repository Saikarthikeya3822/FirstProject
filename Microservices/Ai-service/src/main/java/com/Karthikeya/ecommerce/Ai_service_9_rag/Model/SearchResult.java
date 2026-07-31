package com.Karthikeya.ecommerce.Ai_service_9_rag.Model;

public class SearchResult {

    private String content;
    private Double distance;

    public SearchResult() {
    }

    public SearchResult(String content, Double distance) {
        this.content = content;
        this.distance = distance;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }
}

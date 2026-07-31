package com.Karthikeya.ecommerce.Ai_service_2_Model;


import java.util.List;
import java.util.Map;


public class AIResponse {

    private String responseType;

    private String summary;

    private String recommendationReason;

    private String budgetAnalysis;

    private List<Product> products;

    private List<Order> orders;

    private Object analytics;

    private Map<String, Object> metadata;

    public String getResponseType() {
        return responseType;
    }

    public void setResponseType(String responseType) {
        this.responseType = responseType;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }

    public String getBudgetAnalysis() {
        return budgetAnalysis;
    }

    public void setBudgetAnalysis(String budgetAnalysis) {
        this.budgetAnalysis = budgetAnalysis;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public Object getAnalytics() {
        return analytics;
    }

    public void setAnalytics(Object analytics) {
        this.analytics = analytics;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}

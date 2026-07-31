package com.Karthikeya.ecommerce.Ai_service_4_memory;

import java.io.Serializable;

import com.Karthikeya.ecommerce.Ai_service_2_Model.AIResponse;

public class ChatMessage implements Serializable {

    private String role;

    private String content;

    private AIResponse aiResponse;

    public ChatMessage() {
    }

    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }

    public ChatMessage(String role, String content, AIResponse aiResponse) {
        this.role = role;
        this.content = content;
        this.aiResponse = aiResponse;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public AIResponse getAiResponse() {
        return aiResponse;
    }

    public void setAiResponse(AIResponse aiResponse) {
        this.aiResponse = aiResponse;
    }
}
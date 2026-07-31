package com.Karthikeya.ecommerce.Ai_service_9_rag.Model;

public class RagDocumentChunk {
	private Long id;

    private String content;

    // store vector as String for now

    private String embedding;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getEmbedding() {
		return embedding;
	}

	public void setEmbedding(String embedding) {
		this.embedding = embedding;
	}

}

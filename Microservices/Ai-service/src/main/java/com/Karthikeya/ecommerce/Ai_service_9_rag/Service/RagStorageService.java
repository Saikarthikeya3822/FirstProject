package com.Karthikeya.ecommerce.Ai_service_9_rag.Service;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_9_rag.Model.SearchResult;

@Service
public class RagStorageService {

	private final JdbcTemplate jdbcTemplate;

	public RagStorageService(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void saveChunk(String content, List<Double> embedding) {

		String vector = toVectorString(embedding);

		jdbcTemplate.update("""
				    INSERT INTO rag_document_chunks(content, embedding)
				    VALUES (?, ?::vector)
				""", content, vector);
	}

	private String toVectorString(List<Double> embedding) {

		StringBuilder sb = new StringBuilder("[");

		for (int i = 0; i < embedding.size(); i++) {

			sb.append(embedding.get(i));

			if (i < embedding.size() - 1) {
				sb.append(",");
			}
		}

		sb.append("]");

		return sb.toString();
	}
	public List<SearchResult> search(List<Double> embedding) {

	    String vector = toVectorString(embedding);

	    return jdbcTemplate.query(
	            """
	            SELECT content,
	                   embedding <=> CAST(? AS vector) AS distance
	            FROM rag_document_chunks
	            ORDER BY embedding <=> CAST(? AS vector)
	            LIMIT 3
	            """,
	            (rs, rowNum) -> new SearchResult(
	                    rs.getString("content"),
	                    rs.getDouble("distance")),
	            vector,
	            vector
	    );
	}
}

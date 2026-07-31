package com.Karthikeya.ecommerce.Ai_service_9_rag.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Karthikeya.ecommerce.Ai_service_9_rag.Model.RagQuestionRequest;
import com.Karthikeya.ecommerce.Ai_service_9_rag.Model.SearchResult;
import com.Karthikeya.ecommerce.Ai_service_9_rag.Service.GoogleEmbeddingService;
import com.Karthikeya.ecommerce.Ai_service_9_rag.Service.PdfIngestionService;
import com.Karthikeya.ecommerce.Ai_service_9_rag.Service.RagAnswerService;
import com.Karthikeya.ecommerce.Ai_service_9_rag.Service.RagStorageService;

@RestController
@RequestMapping("/embedding")
public class EmbeddingController {

	@Autowired
	private GoogleEmbeddingService embeddingService;

	@Autowired
	private RagStorageService ragStorageService;
	@Autowired
	private RagAnswerService ragAnswerService;
	@Autowired
	private PdfIngestionService pdfIngestionService;

	private void save(String text) {

		List<Double> embedding = embeddingService.generateEmbedding(text);

		ragStorageService.saveChunk(text, embedding);
	}

	@GetMapping("/load-sample")
	public String loadSample() {

		save("Spring AI is used for building AI applications");

		save("Redis is an in-memory database");

		save("PostgreSQL supports relational databases");

		save("Docker is used to run containers");

		save("Gemini provides embeddings and chat models");

		return "Loaded";
	}

	@GetMapping("/search")
	public List<SearchResult> search() {

		List<Double> questionVector = embeddingService.generateEmbedding("What is Redis?");

		return ragStorageService.search(questionVector);
	}

	@PostMapping("/ask")
	public String ask(@RequestBody RagQuestionRequest request) {

		return ragAnswerService.answer(request.getQuestion());
	}

	@PostMapping("/upload")
	public String upload(@RequestParam("file") MultipartFile file) throws Exception {

		pdfIngestionService.ingest(file);

		return "PDF Uploaded Successfully";
	}
}

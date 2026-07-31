package com.Karthikeya.ecommerce.Ai_service_9_rag.Service;

import java.io.File;
import java.util.List;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PdfIngestionService {

	@Autowired
	private RagStorageService ragStorageService;

	@Autowired
	private GoogleEmbeddingService embeddingService;

	public void ingest(MultipartFile file) throws Exception {

		// Create temporary file

		File tempFile = File.createTempFile("upload", ".pdf");

		file.transferTo(tempFile);

		// Read PDF

		PagePdfDocumentReader reader = new PagePdfDocumentReader(new FileSystemResource(tempFile));

		List<Document> documents = reader.read();

		// Process each page

		for (Document document : documents) {

			String content = document.getText();

			if (content == null || content.isBlank()) {
				continue;
			}

			System.out.println("Processing page: " + content.substring(0, Math.min(100, content.length())));

			List<Double> embedding = embeddingService.generateEmbedding(content);

			ragStorageService.saveChunk(content, embedding);
		}

		tempFile.delete();

		System.out.println("PDF ingestion completed successfully.");
	}
}
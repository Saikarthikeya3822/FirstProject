package com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_2_Model.Product;
import com.Karthikeya.ecommerce.Ai_service_2_Model.ProductAnalysisResponse;
import com.Karthikeya.ecommerce.Ai_service_2_Model.ProductComparisonResponse;
import com.Karthikeya.ecommerce.Ai_service_6_external_clients.ProductClient;

@Service
public class ProductAnalysisService {

	private final ChatClient chatClient;

	public ProductAnalysisService(@Qualifier("productAnalysisChatClient") ChatClient chatClient) {

		this.chatClient = chatClient;
	}

	@Autowired
	private ProductClient productClient;

	public ProductAnalysisResponse analyze(Integer productId,

			String token) {
		Product product = productClient.getProductById(productId, token);

		String prompt = """
				Product Name: %s

				Category: %s

				Description: %s

				Analyze this product.

				Return:

				summary
				pros
				cons
				alternatives
				recommendation
				""".formatted(product.getProdname(), product.getCategory(), product.getDescription());

		return chatClient.prompt().user(prompt).call().entity(ProductAnalysisResponse.class);
	}
	public ProductComparisonResponse compareProducts(
	        Product product1,
	        Product product2) {

	    String prompt = """
	        Compare these two ecommerce products.

	        Product 1:
	        Name: %s
	        Category: %s
	        Price: %s
	        Description: %s

	        Product 2:
	        Name: %s
	        Category: %s
	        Price: %s
	        Description: %s

	        Return JSON only:

	        {
	          "summary":"",
	          "recommendedProduct":"",
	          "reason":""
	        }

	        Choose the better value product.
	        """
	            .formatted(
	                    product1.getProdname(),
	                    product1.getCategory(),
	                    product1.getPrice(),
	                    product1.getDescription(),

	                    product2.getProdname(),
	                    product2.getCategory(),
	                    product2.getPrice(),
	                    product2.getDescription());

	    return chatClient
	            .prompt()
	            .user(prompt)
	            .call()
	            .entity(ProductComparisonResponse.class);
	}
}
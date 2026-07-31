package com.Karthikeya.ecommerce.Ai_service_5_Tools;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_2_Model.Product;
import com.Karthikeya.ecommerce.Ai_service_6_external_clients.ProductClient;
import com.Karthikeya.ecommerce.Ai_service_8_util.SecurityUtil;

@Service
public class AIProductTool {

	private static final Logger logger = LoggerFactory.getLogger(AIProductTool.class);

	private final ProductClient productClient;
	private String token;
	
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public AIProductTool(ProductClient productClient) {
		this.productClient = productClient;
	}

	@Tool(name = "searchProducts", description = """
			Search ecommerce products using category and budget.

			Example:
			- category=laptop
			- budget=50000

			Returns matching active products.
			""")
	public List<Product> searchProducts(String category, Double budget) {

		logger.info("AI requested product search category={} budget={}", category, budget);
		// Fetch all products
		logger.info("Fetched token={}", token);
		List<Product> products = productClient.getAllProducts(token);
		logger.info("Fetched {} products from product-service", products.size());

		// Active products only
		products = products.stream().filter(Product::isActive).collect(Collectors.toList());

		logger.info("Active products count: {}", products.size());

		// Category filtering
		if (category != null && !category.isBlank()) {

			products = products.stream()
					.filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(category))
					.collect(Collectors.toList());

			logger.info("After category filter: {}", products.size());
		}

		// Budget filtering
		if (budget != null) {

			products = products.stream().filter(p -> p.getPrice().compareTo(BigDecimal.valueOf(budget)) <= 0)
					.collect(Collectors.toList());

			logger.info("After budget filter: {}", products.size());
		}

		logger.info("Final filtered products count={}", products.size());

		return products;
	}
}
package com.Karthikeya.ecommerce.Ai_service_6_external_clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.Karthikeya.ecommerce.Ai_service_2_Model.Product;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {

	@GetMapping("/products/getproducts")
	List<Product> getAllProducts(@RequestHeader("Authorization") String token);

	@GetMapping("/products/search")
	List<Product> search(@RequestParam String keyword, @RequestHeader("Authorization") String token);

	@GetMapping("/products/filter")
	List<Product> filter(@RequestParam String status, @RequestParam String price,
			@RequestHeader("Authorization") String token);

	@GetMapping("/products/{id}")
	Product getProductById(@PathVariable Integer id, @RequestHeader("Authorization") String token);
}

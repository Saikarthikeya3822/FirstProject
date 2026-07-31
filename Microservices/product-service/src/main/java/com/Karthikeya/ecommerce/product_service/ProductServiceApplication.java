package com.Karthikeya.ecommerce.product_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.Karthikeya.ecommerce.product_service",
		"com.Karthikeya.ecommerce.product_service_Configurations",
		"com.Karthikeya.common_security",
		"com.Karthikeya.ecommerce.product_service_Controller", 
		"com.Karthikeya.ecommerce.product_service_Service",
		"com.Karthikeya.ecommerce.product_service_Repo" })
@EnableJpaRepositories(basePackages = "com.Karthikeya.ecommerce.product_service_Repo" // ✅ JPA needs this
)
@EntityScan(basePackages = "com.Karthikeya.ecommerce.product_service_Model" // ✅ Entities need this
)
public class ProductServiceApplication {

	public static void main(String[] args) {
		System.out.println("Product Service Started - CI/CD Test");
		SpringApplication.run(ProductServiceApplication.class, args);
	}

}

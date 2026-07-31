package com.Karthikeya.ecommerce.cart_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.Karthikeya.ecommerce.cart_service",
		"com.Karthikeya.ecommerce.cart_service_Configurations", "com.Karthikeya.ecommerce.cart_service_Controller","com.Karthikeya.ecommerce.cart_service_DTO",
		"com.Karthikeya.ecommerce.cart_service_Service", "com.Karthikeya.ecommerce.cart_service_Repo" })

@EnableJpaRepositories(basePackages = "com.Karthikeya.ecommerce.cart_service_Repo" // ✅ JPA needs this
)
@EntityScan(basePackages = "com.Karthikeya.ecommerce.cart_service_Model" // ✅ Entities need this
)
@EnableFeignClients(basePackages = "com.Karthikeya.ecommerce")
public class CartServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CartServiceApplication.class, args);
	}

}

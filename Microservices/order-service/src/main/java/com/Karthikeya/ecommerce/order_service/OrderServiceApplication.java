package com.Karthikeya.ecommerce.order_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.Karthikeya.ecommerce.order_service",
		"com.Karthikeya.ecommerce.order_service_Configurations", "com.Karthikeya.ecommerce.order_service_Controller",
		"com.Karthikeya.ecommerce.order_service_Service", "com.Karthikeya.ecommerce.order_service_Repo" })

@EnableJpaRepositories(basePackages = "com.Karthikeya.ecommerce.order_service_Repo" // ✅ JPA needs this
)
@EntityScan(basePackages = "com.Karthikeya.ecommerce.order_service_Model" // ✅ Entities need this
)
public class OrderServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
	}

}

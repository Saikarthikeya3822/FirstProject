package com.Karthikeya.ecommerce.Ai_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.Karthikeya.ecommerce.Ai_service",
		"com.Karthikeya.ecommerce.Ai_service_1_controller", "com.Karthikeya.ecommerce.Ai_service_2_Model",
		"com.Karthikeya.ecommerce.Ai_service_3_ai_orchestration", "com.Karthikeya.ecommerce.Ai_service_4_memory",
		"com.Karthikeya.ecommerce.Ai_service_5_Tools" ,"com.Karthikeya.ecommerce.Ai_service_6_external_clients",
		"com.Karthikeya.ecommerce.Ai_service_7_config", "com.Karthikeya.ecommerce.Ai_service_8_util","com.Karthikeya.ecommerce.Ai_service_9_rag.Controller","com.Karthikeya.ecommerce.Ai_service_9_rag.Model","com.Karthikeya.ecommerce.Ai_service_9_rag.Service"})

@EntityScan(basePackages = "com.Karthikeya.ecommerce.Ai_service_2_Model" // ✅ Entities need this
)
@EnableFeignClients(basePackages = "com.Karthikeya.ecommerce")
public class AiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiServiceApplication.class, args);
	}

}

package com.Karthikeya.ecommerce.User_activity_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.Karthikeya.ecommerce.User_activity_service",
		"com.Karthikeya.ecommerce.User_activity_Config",
		"com.Karthikeya.eccommerce.User_activity_Controller", 
		"com.Karthikeya.ecommerce.User_activity_service_Service",
		"com.Karthikeya.ecommerce.User_activity_Repo","com.Karthikeya.ecommerce.User_activity_dto" ,"com.Karthikeya.ecommerce.User_activity_Clients"})
@EnableJpaRepositories(basePackages = "com.Karthikeya.ecommerce.User_activity_Repo" // ✅ JPA needs this
)
@EntityScan(basePackages = "com.Karthikeya.ecommerce.User_activity_Model" // ✅ Entities need this
)
@EnableFeignClients(basePackages = "com.Karthikeya.ecommerce")
public class UserActivityServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserActivityServiceApplication.class, args);
	}

}

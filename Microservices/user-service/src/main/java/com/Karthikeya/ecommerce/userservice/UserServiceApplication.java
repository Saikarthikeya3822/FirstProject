package com.Karthikeya.ecommerce.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
    "com.Karthikeya.ecommerce.userservice",
    "com.Karthikeya.ecommerce.userserviceController",
    "com.Karthikeya.ecommerce.userservice.Configurations",
    "com.Karthikeya.ecommerce.userserviceService",
    "com.Karthikeya.ecommerce.userserviceRepo"
})
@EnableJpaRepositories(
    basePackages = "com.Karthikeya.ecommerce.userserviceRepo"  // ✅ JPA needs this
)
@EntityScan(
    basePackages = "com.Karthikeya.ecommerce.userserviceModel" // ✅ Entities need this
)
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

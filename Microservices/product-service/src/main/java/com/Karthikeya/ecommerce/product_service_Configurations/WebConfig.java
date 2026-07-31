package com.Karthikeya.ecommerce.product_service_Configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		String path = System.getProperty("user.dir") + "/images/";

		registry.addResourceHandler("/images/**").addResourceLocations("file:" + path);
	}
}

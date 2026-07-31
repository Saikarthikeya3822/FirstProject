package com.Karthikeya.ecommerce.User_activity_Clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.Karthikeya.ecommerce.User_activity_Config.FeignClientConfig;
import com.Karthikeya.ecommerce.User_activity_dto.ProductResponse;

@FeignClient(name = "PRODUCT-SERVICE",configuration = FeignClientConfig.class)
public interface ProductClient {

    @GetMapping("/products/{id}")
    ProductResponse getProduct(
            @PathVariable("id") int id);
}

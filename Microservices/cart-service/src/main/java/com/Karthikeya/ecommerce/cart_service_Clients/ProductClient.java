package com.Karthikeya.ecommerce.cart_service_Clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.Karthikeya.ecommerce.cart_service_DTO.ProductDto;

@FeignClient(name = "product-service")
public interface ProductClient {

    @PostMapping("/products/by-ids")
    List<ProductDto> getProductsByIds(
            @RequestBody List<Integer> productIds, @RequestHeader("Authorization") String token);
}

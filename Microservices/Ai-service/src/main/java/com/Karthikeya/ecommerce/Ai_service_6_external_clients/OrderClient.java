package com.Karthikeya.ecommerce.Ai_service_6_external_clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.Karthikeya.ecommerce.Ai_service_2_Model.Order;

@FeignClient(name = "ORDER-SERVICE")
public interface OrderClient {

    @GetMapping("/orders/all")
    List<Order> getAllOrders(
            @RequestHeader("Authorization")
            String token
    );
}
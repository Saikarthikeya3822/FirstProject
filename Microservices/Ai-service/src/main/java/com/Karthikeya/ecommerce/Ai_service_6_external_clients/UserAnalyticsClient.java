package com.Karthikeya.ecommerce.Ai_service_6_external_clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.Karthikeya.ecommerce.Ai_service_2_Model.UserAnalyticsResponse;

@FeignClient(name = "user-activity-service")
public interface UserAnalyticsClient {

	@GetMapping("/activities/users/{userId}/analytics")
	UserAnalyticsResponse getUserAnalytics(@PathVariable("userId") String userId, @RequestParam("days") Integer days,@RequestHeader("Authorization") String token);
}

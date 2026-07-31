package com.Karthikeya.eccommerce.User_activity_Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Karthikeya.ecommerce.User_activity_Model.ActivityRequest;
import com.Karthikeya.ecommerce.User_activity_Model.DashboardResponse;
import com.Karthikeya.ecommerce.User_activity_dto.ProductAnalyticsDTO;
import com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO;
import com.Karthikeya.ecommerce.User_activity_dto.UserAnalyticsResponse;
import com.Karthikeya.ecommerce.User_activity_service_Service.ActivityService;

@RestController
@RequestMapping("/activities")
public class ActivityController {
	@Autowired
	private ActivityService activityService;

	@PostMapping
	public ResponseEntity<String> saveActivity(@RequestBody ActivityRequest request) {

		activityService.saveActivity(request);

		return ResponseEntity.ok("Activity Saved");
	}

	@GetMapping("/dashboard")
	public DashboardResponse Dashboard() {

		return activityService.getDashboard();
	}

	@GetMapping("/top-viewed-products")
	public List<ProductAnalyticsDTO> getTopViewedProducts() {
		return activityService.getTopViewedProductsDetails();
	}

	@GetMapping("/top-cart-products")
	public List<ProductCountDTO> getTopCartProducts(@RequestHeader("Authorization") String token) {
		return activityService.getTopCartProducts();
	}

	@GetMapping("/top-purchased-products")
	public List<ProductCountDTO> getTopPurchasedProducts(@RequestHeader("Authorization") String token) {
		return activityService.getTopPurchasedProducts();
	}

	@GetMapping("/users/{userId}/analytics")
	public ResponseEntity<UserAnalyticsResponse>getUserAnalytic(@PathVariable String userId,
			@RequestParam(defaultValue = "30") Integer days) {

		return ResponseEntity.ok(activityService.getUserAnalytics(userId, days));
	}
}

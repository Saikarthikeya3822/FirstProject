package com.Karthikeya.ecommerce.User_activity_service_Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.User_activity_Clients.ProductClient;
import com.Karthikeya.ecommerce.User_activity_Model.ActivityRequest;
import com.Karthikeya.ecommerce.User_activity_Model.ActivityType;
import com.Karthikeya.ecommerce.User_activity_Model.DashboardResponse;
import com.Karthikeya.ecommerce.User_activity_Model.UserActivity;
import com.Karthikeya.ecommerce.User_activity_Repo.UserActivityRepository;
import com.Karthikeya.ecommerce.User_activity_dto.CategoryAnalyticsDTO;
import com.Karthikeya.ecommerce.User_activity_dto.ProductAnalyticsDTO;
import com.Karthikeya.ecommerce.User_activity_dto.ProductCountDTO;
import com.Karthikeya.ecommerce.User_activity_dto.ProductResponse;
import com.Karthikeya.ecommerce.User_activity_dto.RecentViewDTO;
import com.Karthikeya.ecommerce.User_activity_dto.TimelineDTO;
import com.Karthikeya.ecommerce.User_activity_dto.UserAnalyticsResponse;

@Service
public class ActivityService {
	@Autowired
	private UserActivityRepository repository;
	@Autowired
	private ProductClient productClient;

	public void saveActivity(ActivityRequest request) {
		UserActivity activity = new UserActivity();

		activity.setUserId(request.getUserId());
		activity.setProductId(request.getProductId());
		activity.setActivityType(request.getActivityType());
		activity.setMetadata(request.getMetadata());
		activity.setCreatedAt(LocalDateTime.now());

		repository.save(activity);
	}

	public DashboardResponse getDashboard() {

		DashboardResponse response = new DashboardResponse();

		response.setTotalViews(repository.countByActivityType(ActivityType.VIEW_PRODUCT));

		response.setTotalCartAdds(repository.countByActivityType(ActivityType.ADD_TO_CART));

		response.setTotalPurchases(repository.countByActivityType(ActivityType.PURCHASE_PRODUCT));

		return response;
	}

	public List<ProductCountDTO> getTopViewedProducts() {
		return repository.getTopViewedProducts();
	}

	public List<ProductCountDTO> getTopCartProducts() {
		return repository.getTopCartProducts();
	}

	public List<ProductCountDTO> getTopPurchasedProducts() {
		return repository.getTopPurchasedProducts();
	}

	public List<ProductAnalyticsDTO> getTopViewedProductsDetails() {

		List<ProductCountDTO> products = repository.getTopViewedProducts();

		List<ProductAnalyticsDTO> result = new ArrayList<>();

		for (ProductCountDTO product : products) {

			ProductResponse response = productClient.getProduct(product.getProductId().intValue());

			ProductAnalyticsDTO dto = new ProductAnalyticsDTO();

			dto.setProductId(product.getProductId());

			dto.setProductName(response.getProdname());

			dto.setCategory(response.getCategory());

			dto.setCount(product.getCount());

			result.add(dto);
		}

		return result;
	}

	private List<CategoryAnalyticsDTO> getCategoryBreakdown(String userId, LocalDateTime fromDate) {

		List<Object[]> rows = repository.getCategoryBreakdown(userId, fromDate);

		List<CategoryAnalyticsDTO> result = new ArrayList<>();

		for (Object[] row : rows) {

			CategoryAnalyticsDTO dto = new CategoryAnalyticsDTO();

			dto.setCategory((String) row[0]);

			dto.setCount(((Number) row[1]).longValue());

			result.add(dto);
		}

		return result;
	}

	private String getMostPurchasedCategory(String userId, LocalDateTime fromDate) {

		List<Object[]> rows = repository.getMostPurchasedCategory(userId, fromDate);

		if (rows.isEmpty()) {
			return "N/A";
		}

		return (String) rows.get(0)[0];
	}

	public UserAnalyticsResponse getUserAnalytics(String userId, Integer days) {

		LocalDateTime fromDate = LocalDateTime.now().minusDays(days);

		UserAnalyticsResponse response = new UserAnalyticsResponse();

		response.setUserId(userId);

		Long views = repository.countActivities(userId, ActivityType.VIEW_PRODUCT, fromDate);

		Long carts = repository.countActivities(userId, ActivityType.ADD_TO_CART, fromDate);

		Long purchases = repository.countActivities(userId, ActivityType.PURCHASE_PRODUCT, fromDate);

		response.setTotalViews(views);
		response.setTotalCartAdds(carts);
		response.setTotalPurchases(purchases);

		double conversion = 0.0;

		if (views > 0) {

			conversion = Math.round(((purchases * 100.0) / views) * 100.0) / 100.0;
		}

		response.setConversionRate(conversion);

		ProductAnalyticsDTO viewed = buildProductAnalytics(repository.getMostViewedProductsByUser(userId));

		response.setMostViewedProduct(viewed);

		ProductAnalyticsDTO cart = buildProductAnalytics(repository.getMostCartProductsByUser(userId));

		response.setMostCartAddedProduct(cart);

		ProductAnalyticsDTO purchased = buildProductAnalytics(repository.getMostPurchasedProductsByUser(userId));

		response.setMostPurchasedProduct(purchased);

		List<CategoryAnalyticsDTO> categories = getCategoryBreakdown(userId, fromDate);

		response.setCategoryBreakdown(categories);

		if (!categories.isEmpty()) {

			response.setMostViewedCategory(categories.get(0).getCategory());
		}

		response.setMostPurchasedCategory(getMostPurchasedCategory(userId, fromDate));

		response.setRecentViews(getRecentViews(userId, fromDate));

		response.setTimeline(getTimeline(userId, fromDate));
		System.out.println("Categories : " + categories.size());

		for (CategoryAnalyticsDTO dto : categories) {
			System.out.println(dto.getCategory() + " -> " + dto.getCount());
		}

		System.out.println("Most Viewed Category : " + response.getMostViewedCategory());

		System.out.println("Most Purchased Category : " + response.getMostPurchasedCategory());

		return response;
	}

	private ProductAnalyticsDTO buildProductAnalytics(List<ProductCountDTO> products) {

		if (products == null || products.isEmpty()) {
			return null;
		}

		ProductCountDTO top = products.get(0);

		ProductResponse product = productClient.getProduct(top.getProductId().intValue());

		ProductAnalyticsDTO dto = new ProductAnalyticsDTO();

		dto.setProductId(top.getProductId());

		dto.setProductName(product.getProdname());

		dto.setCategory(product.getCategory());

		dto.setCount(top.getCount());

		return dto;
	}

	private List<RecentViewDTO> getRecentViews(String userId, LocalDateTime fromDate) {

		List<UserActivity> activities = repository
				.findTop10ByUserIdAndActivityTypeAndCreatedAtAfterOrderByCreatedAtDesc(userId,
						ActivityType.VIEW_PRODUCT, fromDate);

		List<RecentViewDTO> result = new ArrayList<>();

		for (UserActivity activity : activities) {

			ProductResponse product = productClient.getProduct(activity.getProductId().intValue());

			RecentViewDTO dto = new RecentViewDTO();

			dto.setProductId(activity.getProductId());

			dto.setProductName(product.getProdname());

			dto.setCategory(product.getCategory());

			dto.setViewedAt(activity.getCreatedAt());

			result.add(dto);
		}

		return result;
	}

	private List<TimelineDTO> getTimeline(String userId, LocalDateTime fromDate) {

		List<UserActivity> activities = repository.findTop20ByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(userId,
				fromDate);

		List<TimelineDTO> result = new ArrayList<>();

		for (UserActivity activity : activities) {

			ProductResponse product = productClient.getProduct(activity.getProductId().intValue());

			TimelineDTO dto = new TimelineDTO();

			dto.setActivityType(activity.getActivityType().name());

			dto.setProductId(activity.getProductId());

			dto.setProductName(product.getProdname());

			dto.setCreatedAt(activity.getCreatedAt());

			result.add(dto);
		}

		return result;
	}

}

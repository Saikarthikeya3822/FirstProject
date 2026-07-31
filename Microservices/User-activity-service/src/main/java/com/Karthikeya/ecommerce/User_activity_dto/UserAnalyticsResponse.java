package com.Karthikeya.ecommerce.User_activity_dto;

import java.util.List;

public class UserAnalyticsResponse {
	private String userId;

	private Long totalViews;

	private Long totalCartAdds;

	private Long totalPurchases;

	private Double conversionRate;

	private ProductAnalyticsDTO mostViewedProduct;

	private ProductAnalyticsDTO mostCartAddedProduct;

	private ProductAnalyticsDTO mostPurchasedProduct;

	private List<RecentViewDTO> recentViews;

	private String mostViewedCategory;

	private String mostPurchasedCategory;
	private List<CategoryAnalyticsDTO> categoryBreakdown;
	private List<TimelineDTO> timeline;

	public String getMostViewedCategory() {
		return mostViewedCategory;
	}

	public void setMostViewedCategory(String mostViewedCategory) {
		this.mostViewedCategory = mostViewedCategory;
	}

	public String getMostPurchasedCategory() {
		return mostPurchasedCategory;
	}

	public void setMostPurchasedCategory(String mostPurchasedCategory) {
		this.mostPurchasedCategory = mostPurchasedCategory;
	}

	public List<CategoryAnalyticsDTO> getCategoryBreakdown() {
		return categoryBreakdown;
	}

	public void setCategoryBreakdown(List<CategoryAnalyticsDTO> categoryBreakdown) {
		this.categoryBreakdown = categoryBreakdown;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Long getTotalViews() {
		return totalViews;
	}

	public void setTotalViews(Long totalViews) {
		this.totalViews = totalViews;
	}

	public Long getTotalCartAdds() {
		return totalCartAdds;
	}

	public void setTotalCartAdds(Long totalCartAdds) {
		this.totalCartAdds = totalCartAdds;
	}

	public Long getTotalPurchases() {
		return totalPurchases;
	}

	public void setTotalPurchases(Long totalPurchases) {
		this.totalPurchases = totalPurchases;
	}

	public Double getConversionRate() {
		return conversionRate;
	}

	public void setConversionRate(Double conversionRate) {
		this.conversionRate = conversionRate;
	}

	public ProductAnalyticsDTO getMostViewedProduct() {
		return mostViewedProduct;
	}

	public void setMostViewedProduct(ProductAnalyticsDTO mostViewedProduct) {
		this.mostViewedProduct = mostViewedProduct;
	}

	public ProductAnalyticsDTO getMostCartAddedProduct() {
		return mostCartAddedProduct;
	}

	public void setMostCartAddedProduct(ProductAnalyticsDTO mostCartAddedProduct) {
		this.mostCartAddedProduct = mostCartAddedProduct;
	}

	public ProductAnalyticsDTO getMostPurchasedProduct() {
		return mostPurchasedProduct;
	}

	public void setMostPurchasedProduct(ProductAnalyticsDTO mostPurchasedProduct) {
		this.mostPurchasedProduct = mostPurchasedProduct;
	}

	public List<RecentViewDTO> getRecentViews() {
		return recentViews;
	}

	public void setRecentViews(List<RecentViewDTO> recentViews) {
		this.recentViews = recentViews;
	}

	public List<TimelineDTO> getTimeline() {
		return timeline;
	}

	public void setTimeline(List<TimelineDTO> timeline) {
		this.timeline = timeline;
	}

}

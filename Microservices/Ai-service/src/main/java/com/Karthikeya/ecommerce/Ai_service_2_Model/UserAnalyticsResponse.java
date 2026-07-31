package com.Karthikeya.ecommerce.Ai_service_2_Model;

public class UserAnalyticsResponse {

	private Long totalViews;

	private Long totalCartAdds;

	private Long totalPurchases;

	private Double conversionRate;

	private String mostViewedCategory;

	private String mostPurchasedCategory;

	private ProductAnalyticsDTO mostViewedProduct;

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

	public ProductAnalyticsDTO getMostViewedProduct() {
		return mostViewedProduct;
	}

	public void setMostViewedProduct(ProductAnalyticsDTO mostViewedProduct) {
		this.mostViewedProduct = mostViewedProduct;
	}
}
package com.Karthikeya.ecommerce.Ai_service_2_Model;

public class ProductComparisonResponse {

	private String summary;

	private String recommendedProduct;

	private String reason;

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getRecommendedProduct() {
		return recommendedProduct;
	}

	public void setRecommendedProduct(String recommendedProduct) {
		this.recommendedProduct = recommendedProduct;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
}

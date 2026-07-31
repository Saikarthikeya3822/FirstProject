package com.Karthikeya.ecommerce.Ai_service_2_Model;

public class UserInsightResponse {

    private String customerSummary;

    private String purchaseIntent;

    private String productInterests;

    private String recommendedAction;

	public String getCustomerSummary() {
		return customerSummary;
	}

	public void setCustomerSummary(String customerSummary) {
		this.customerSummary = customerSummary;
	}

	public String getPurchaseIntent() {
		return purchaseIntent;
	}

	public void setPurchaseIntent(String purchaseIntent) {
		this.purchaseIntent = purchaseIntent;
	}

	public String getProductInterests() {
		return productInterests;
	}

	public void setProductInterests(String productInterests) {
		this.productInterests = productInterests;
	}

	public String getRecommendedAction() {
		return recommendedAction;
	}

	public void setRecommendedAction(String recommendedAction) {
		this.recommendedAction = recommendedAction;
	}

    // getters/setters
}

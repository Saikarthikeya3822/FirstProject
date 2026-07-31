package com.Karthikeya.ecommerce.User_activity_Model;

public class DashboardResponse {
	private long totalViews;

    public long getTotalViews() {
		return totalViews;
	}

	public void setTotalViews(long totalViews) {
		this.totalViews = totalViews;
	}

	public long getTotalCartAdds() {
		return totalCartAdds;
	}

	public void setTotalCartAdds(long totalCartAdds) {
		this.totalCartAdds = totalCartAdds;
	}

	public long getTotalPurchases() {
		return totalPurchases;
	}

	public void setTotalPurchases(long totalPurchases) {
		this.totalPurchases = totalPurchases;
	}

	private long totalCartAdds;

    private long totalPurchases;


}

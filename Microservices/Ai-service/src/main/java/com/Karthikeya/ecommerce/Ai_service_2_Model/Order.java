package com.Karthikeya.ecommerce.Ai_service_2_Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Order {

	private Long orderId;

	private String productname;
	private String category;

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	private BigDecimal price;

	private LocalDateTime  orderDate;

	public Order() {
	}

	public Order(Long orderId, String productname, BigDecimal price, LocalDateTime  orderDate) {

		this.orderId = orderId;
		this.productname = productname;
		this.price = price;
		this.orderDate = orderDate;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public String getProductName() {
		return productname;
	}

	public void setProductname(String productname) {
		this.productname = productname;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public LocalDateTime  getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDateTime orderDate) {
		this.orderDate = orderDate;
	}
}
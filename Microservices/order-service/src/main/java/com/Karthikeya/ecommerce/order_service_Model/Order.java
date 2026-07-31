package com.Karthikeya.ecommerce.order_service_Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_id")
	private int orderId;

	@Column(name = "username")
	private String username;

	@Column(name = "productname")
	private String productname;
	@Column(name = "category")
	private String category;

	@Column(name = "state")
	private String state;

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public void setOrderDate(LocalDateTime orderDate) {
		this.orderDate = orderDate;
	}

	@Column(name = "region")
	private String region;

	@Column(name = "status")
	private String status;

	@Column(name = "price")
	private BigDecimal price;

	@Column(name = "prod_id")
	private int prodId;

	@Column(name = "order_date", insertable = false, updatable = false)
	private LocalDateTime orderDate;

	public Order() {
	}

	public Order(int orderId, String username, String productname, String category,String state, String region, String status,
			BigDecimal price, int prodId) {
		this.orderId = orderId;
		this.username = username;
		this.productname = productname;
		this.category=category;
		this.state = state;
		this.region = region;
		this.status = status;
		this.price = price;
		this.prodId = prodId;
	}

	// Getters & Setters

	public int getOrderId() {
		return orderId;
	}

	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getProductname() {
		return productname;
	}

	public void setProductname(String productname) {
		this.productname = productname;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public int getProdId() {
		return prodId;
	}

	public void setProdId(int prodId) {
		this.prodId = prodId;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}
}
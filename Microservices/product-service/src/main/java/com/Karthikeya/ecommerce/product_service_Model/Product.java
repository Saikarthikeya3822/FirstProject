package com.Karthikeya.ecommerce.product_service_Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "product")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "prodid")
	private int prodid;
	@Column(name = "prodname")
	private String prodname;
	@Column(name = "category")
	private String category;
	@Column(name = "description")
	private String description;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "price")
	private BigDecimal price;

	@Column(name = "creation_date")
	private LocalDateTime creationDate;

	@Column(name = "lastupdated")
	private LocalDateTime lastupdated;

	@Column(name = "image_url")
	private String imageUrl;

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	@Column(name = "is_active")
	private boolean isActive;

	// Constructors
	public Product() {
	}

	public Product(boolean isActive, LocalDateTime lastupdated, LocalDateTime creationDate, BigDecimal price,
			String prodname, String category, int prodid) {
		this.isActive = isActive;
		this.lastupdated = lastupdated;
		this.creationDate = creationDate;
		this.price = price;
		this.prodname = prodname;
		this.category = category;
		this.prodid = prodid;
	}

	// Getters & Setters

	public int getProdid() {
		return prodid;
	}

	public void setProdid(int prodid) {
		this.prodid = prodid;
	}

	public String getProdname() {
		return prodname;
	}

	public void setProdname(String prodname) {
		this.prodname = prodname;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public LocalDateTime getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(LocalDateTime creationDate) {
		this.creationDate = creationDate;
	}

	public LocalDateTime getLastupdated() {
		return lastupdated;
	}

	public void setLastupdated(LocalDateTime lastupdated) {
		this.lastupdated = lastupdated;
	}

	@JsonProperty("isActive")
	public boolean isActive() {
		return isActive;
	}

	@JsonProperty("isActive")
	public void setActive(boolean active) {
		isActive = active;
	}
}

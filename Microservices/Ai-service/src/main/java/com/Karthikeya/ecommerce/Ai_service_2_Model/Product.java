package com.Karthikeya.ecommerce.Ai_service_2_Model;

import java.math.BigDecimal;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Product {

	@JsonProperty("prodid")
	private int prodId;
	private String prodname;
	private String category;
	private String description; // ADD HERE

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

	private BigDecimal price;

	@JsonProperty("imagename")
	private String imageName;

	@JsonProperty("imagetype")
	private String imageType;

	@JsonProperty("isActive")
	private boolean isActive;

	public String getProdname() {
		return prodname;
	}

	public void setProdname(String prodname) {
		this.prodname = prodname;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public int getProdId() {
		return prodId;
	}

	public void setProdId(int prodId) {
		this.prodId = prodId;
	}

	public String getProdName() {
		return prodname;
	}

	public void setProdName(String prodname) {
		this.prodname = prodname;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	public String getImageType() {
		return imageType;
	}

	public void setImageType(String imageType) {
		this.imageType = imageType;
	}

	// getters & setters
}

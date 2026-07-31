package com.Karthikeya.ecommerce.product_service_DTO;

import java.math.BigDecimal;

public class ProductDto {
	private int prodid;
	private String prodname;
	private BigDecimal price;
	private String imageUrl;

	public ProductDto(int prodid, String prodname, BigDecimal price, String imageUrl) {
		this.prodid = prodid;
		this.prodname = prodname;
		this.price = price;
		this.imageUrl = imageUrl;
	}

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

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
}

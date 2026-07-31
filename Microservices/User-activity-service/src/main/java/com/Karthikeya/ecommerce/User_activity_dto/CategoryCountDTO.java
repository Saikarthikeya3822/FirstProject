package com.Karthikeya.ecommerce.User_activity_dto;

public class CategoryCountDTO {

	private String category;
	private Long count;

	public CategoryCountDTO(String category, Long count) {
		this.category = category;
		this.count = count;
	}

	public String getCategory() {
		return category;
	}

	public Long getCount() {
		return count;
	}
}

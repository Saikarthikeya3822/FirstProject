package com.example.ecommerce.model;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Blob;
import java.time.LocalDateTime;
@Entity
@Table(name="product")
public class Product {
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int prodId;

    private String prodName;

    private BigDecimal price; // Use BigDecimal for monetary values

    private LocalDateTime creationDate;

    private LocalDateTime lastUpdated;
    
    private String imageName;
    private String imageType;
    @Lob
    //@Column(name = "image_data", columnDefinition = "BYTEA")
    private byte[] imageData;

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Product(boolean isActive, LocalDateTime lastUpdated, LocalDateTime creationDate, BigDecimal price, String prodName, int prodId) {
        this.isActive = isActive;
        this.lastUpdated = lastUpdated;
        this.creationDate = creationDate;
        this.price = price;
        this.prodName = prodName;
        this.prodId = prodId;
    }

    private boolean isActive;



    public Product(){}



    public int getProdId() {
        return prodId;
    }

    public void setProdId(int prodId) {
        this.prodId = prodId;
    }

    public String getProdName() {
        return prodName;
    }

    public void setProdName(String prodName) {
        this.prodName = prodName;
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

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
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

	public byte[] getImageData() {
		return imageData;
	}

	public void setImageData(byte[] imageData) {
		this.imageData = imageData;
	}

}

package com.Karthikeya.ecommerce.cart_service_Model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cart")
public class Cart {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cartid")
	private int cartid;

	@Column(name = "userid")
	private UUID userid;

	@Column(name = "prodid")
	private int prodid;

	@Column(name = "quantity")
	private Integer quantity = 1;

	public Cart() {

	}

	public Cart(int cartid, UUID userid, int prodid, Integer quantity) {
		this.cartid = cartid;
		this.userid = userid;
		this.prodid = prodid;
		this.quantity = quantity;
	}

	public int getCartid() {
		return cartid;
	}

	public void setCartid(int cartid) {
		this.cartid = cartid;
	}

	public UUID getUserid() {
		return userid;
	}

	public void setUserid(UUID userid) {
		this.userid = userid;
	}

	public int getProdid() {
		return prodid;
	}

	public void setProdid(int prodid) {
		this.prodid = prodid;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

}

package com.Karthikeya.ecommerce.cart_service_Repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Karthikeya.ecommerce.cart_service_Model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

	List<Cart> findByUserid(UUID userid);

}

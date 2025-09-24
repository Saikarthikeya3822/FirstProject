package com.example.ecommerce;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecommerce.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {
	List<Cart> findByUserId(UUID  userId);

}

package com.Karthikeya.ecommerce.cart_service_Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;
import com.Karthikeya.ecommerce.cart_service_Clients.ProductClient;
import com.Karthikeya.ecommerce.cart_service_DTO.ProductDto;
import com.Karthikeya.ecommerce.cart_service_Model.Cart;
import com.Karthikeya.ecommerce.cart_service_Model.CartResponse;
import com.Karthikeya.ecommerce.cart_service_Repo.CartRepository;

import jakarta.transaction.Transactional;

@Service
public class CartService {

	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private ProductClient productClient;
	private static final Logger logger = LoggerFactory.getLogger(CartService.class);

	@Transactional
	public Cart addToCart(Cart cart) {
		logger.info("userId ={} prodId ={} quantity={}", cart.getUserid(), cart.getProdid());
		return cartRepository.save(cart);
	}

	@Transactional
	public List<CartResponse> getCartByUser(UUID userId, String token) {

		List<Cart> cartItems = cartRepository.findByUserid(userId);

		List<Integer> productIds = cartItems.stream().map(Cart::getProdid).toList();

		List<ProductDto> products = productClient.getProductsByIds(productIds, token);

		Map<Integer, ProductDto> productMap = products.stream()
				.collect(Collectors.toMap(ProductDto::getProdid, p -> p));

		return cartItems.stream().map(cart -> {

			ProductDto product = productMap.get(cart.getProdid());

			CartResponse dto = new CartResponse();

			dto.setCartId(cart.getCartid());
			dto.setProductId(cart.getProdid());
			dto.setQuantity(cart.getQuantity());

			if (product != null) {
				dto.setProductName(product.getProdname());
				dto.setPrice(product.getPrice());
				dto.setImageUrl(product.getImageUrl());
			}

			return dto;
		}).toList();
	}
}

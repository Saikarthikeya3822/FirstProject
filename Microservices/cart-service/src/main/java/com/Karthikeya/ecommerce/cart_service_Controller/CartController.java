package com.Karthikeya.ecommerce.cart_service_Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Karthikeya.ecommerce.cart_service_Model.Cart;
import com.Karthikeya.ecommerce.cart_service_Model.CartResponse;
import com.Karthikeya.ecommerce.cart_service_Service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

	@Autowired
	private CartService cartService;

	// Add to cart
	@PostMapping("/addCart")
	public ResponseEntity<Cart> addToCart(@RequestBody Cart cart) {

		Cart savedCart = cartService.addToCart(cart);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedCart);
	}

	// View cart by user
	@GetMapping("/{userId}")
	public ResponseEntity<List<CartResponse>> viewCart(@PathVariable UUID userId, @RequestHeader("Authorization") String token) {
		System.out.println("Hitting get controller");
		List<CartResponse> cartItems = cartService.getCartByUser(userId,token);
		return ResponseEntity.ok(cartItems);
	}
}

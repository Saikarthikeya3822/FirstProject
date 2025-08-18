package com.example.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.service.CartService;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
//@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Add to cart
	    @PostMapping(value = "cart/addCart", consumes = "multipart/form-data")
	    public ResponseEntity<?> addToCart( @RequestPart Cart cart, 
	    		@RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
	    	System.out.println("Hitting addToCart");
        	System.out.println("Recievd cart is:"+cart+"imageFile is:"+imageFile);
	        try {
	        	if (imageFile == null) {
	                return new ResponseEntity<>("No image file received", HttpStatus.BAD_REQUEST);
	            }
	            Cart savedCart = cartService.addToCart(cart, imageFile);
	            return new ResponseEntity<>(savedCart, HttpStatus.CREATED);
	        } catch (Exception e) {
	        	e.printStackTrace();
	            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

    // View cart by user
    @GetMapping("cart/{userId}")
    public ResponseEntity<List<Cart>> viewCart(@PathVariable Long userId) {
         System.out.println("Hitting get controller");
        List<Cart> cartItems = cartService.getCartByUser(userId);
        return ResponseEntity.ok(cartItems);
    }
}


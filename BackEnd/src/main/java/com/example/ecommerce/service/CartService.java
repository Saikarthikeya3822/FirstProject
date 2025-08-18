package com.example.ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.ecommerce.CartRepository;
import com.example.ecommerce.model.Cart;

import jakarta.transaction.Transactional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Transactional
    public Cart addToCart(Cart cart,MultipartFile imageFile) throws  Exception{
        cart.setImageName(imageFile.getOriginalFilename());
        cart.setImageType(imageFile.getContentType());
        cart.setImageData(imageFile.getBytes());
        return cartRepository.save(cart);
    }
    @Transactional   // 👈 This makes sure autoCommit=false
    public List<Cart> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }
}


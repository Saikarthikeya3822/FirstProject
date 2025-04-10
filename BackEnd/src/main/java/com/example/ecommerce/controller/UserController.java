package com.example.ecommerce.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.model.Users;
import com.example.ecommerce.service.UserService;
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to call backend
@RestController
public class UserController {
	 @Autowired
	    private UserService service;


	    @PostMapping("/register")
	    public Users register(@RequestBody Users user) {
	        return service.register(user);

	    }
	    @PostMapping("/login")
	    public ResponseEntity<?> login(@RequestBody Users user) {
	        try {
	            String token = service.verify(user);
	            // this returns token or "fail"
             System.out.println("Status of Token:"+token);
	            if (!"fail".equals(token)) {
	                Map<String, String> response = new HashMap<>();
	                response.put("token", token);
	                return ResponseEntity.ok(response); // return token in JSON format
	            } else {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                        .body(Map.of("message", "Invalid username or password"));
	            }

	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(Map.of("message", "Something went wrong. Try again."));
	        }
	    }
	    

}

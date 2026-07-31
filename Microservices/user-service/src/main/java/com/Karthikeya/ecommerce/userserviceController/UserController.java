package com.Karthikeya.ecommerce.userserviceController;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Karthikeya.ecommerce.userserviceModel.Users;
import com.Karthikeya.ecommerce.userserviceService.KeycloakUserService;



@CrossOrigin(origins = "${frontend.url}") // Allow frontend to call backend
@RestController
public class UserController {
	@Autowired
	private KeycloakUserService keycloakUserService;

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody Users user) {
		System.out.println("Inside Register controller");
		try {
			keycloakUserService.registerUser(user.getUsername(), user.getPassword());
			return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"User registered successfully\"}");
		} catch (RuntimeException e) {
			e.printStackTrace();
			// Check for the specific user already exists error
			if (e.getMessage() != null && e.getMessage().contains("already exists")) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
			} else {
				// For any other RuntimeException, return 500
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body(Map.of("message", "Something went wrong. Try again."));
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("{\"error\": \"Something went wrong: " + e.getMessage() + "\"}");
		}
	}

//	@PostMapping("/login")
//	public ResponseEntity<?> login(@RequestBody Users user) {
//		try {
//			// String token = service.verify(user);
//			// this returns token or "fail"
//			Map<String, String> result = service.verify(user);
//			// System.out.println("Status of Token:"+token);
//			if (!"fail".equals(result.get("status"))) {
//				return ResponseEntity.ok(result); // contains token + role
//			} else {
//				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//						.body(Map.of("message", "Invalid username or password"));
//			}
//
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body(Map.of("message", "Something went wrong. Try again."));
////		}
//	}

}

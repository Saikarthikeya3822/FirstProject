package com.example.ecommerce.service;

import java.util.HashMap;
import java.util.Map;

import javax.naming.AuthenticationException;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ecommerce.UserRepo;
import com.example.ecommerce.model.Users;

@Service
public class UserService {
	@Autowired
    private UserRepo repo;
	 @Autowired
	  private JWTService jwtService;
	 @Autowired
	 AuthenticationManager authManager;
	private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return user;
    }

	public  Map<String, String> verify(Users user) throws AuthenticationException {
		System.out.println("verifying user");
		//System.out.println(encoder.encode("admin123"));
		System.out.println(encoder.encode("johnpass"));
		org.springframework.security.core.Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
		  
		if (authentication.isAuthenticated()) {
			   String token=jwtService.generateToken(user.getUsername());
			   Users dbUser = repo.findByUsername(user.getUsername());
               Map<String, String> result = new HashMap<>();
			   System.out.println("token is:"+ token);
			   result.put("token", token);
		        result.put("role", dbUser.getRole());
		        return result;
		        //return jwtService.generateToken(user.getUsername())  ;
		        } else {
		        	 return Map.of("status", "fail");
		        }
	}
    
    
}

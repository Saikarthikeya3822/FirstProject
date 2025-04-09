package com.example.ecommerce;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ecommerce.model.Users;

public interface UserRepo extends JpaRepository<Users,Integer> {
	Users findByUsername(String username);

}

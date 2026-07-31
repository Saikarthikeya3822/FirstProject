package com.Karthikeya.ecommerce.userserviceRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Karthikeya.ecommerce.userserviceModel.Users;



public interface UserRepo extends JpaRepository<Users, Integer> {
	Users findByUsername(String username);

}

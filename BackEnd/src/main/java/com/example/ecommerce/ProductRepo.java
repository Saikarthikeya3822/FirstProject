package com.example.ecommerce;

import com.example.ecommerce.model.Product;

import java.util.List;

//import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

//import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {
	@Query("SELECT p FROM Product p WHERE " +
		       "LOWER(p.prodName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
		       "('active' LIKE LOWER(CONCAT(:keyword, '%')) AND p.isActive = true) OR " +
		       "('inactive' LIKE LOWER(CONCAT(:keyword, '%')) AND p.isActive = false)")

		List<Product> searchProducts(@Param("keyword") String keyword);

}

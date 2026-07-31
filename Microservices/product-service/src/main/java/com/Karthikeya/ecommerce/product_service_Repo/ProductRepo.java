package com.Karthikeya.ecommerce.product_service_Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Karthikeya.ecommerce.product_service_Model.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

	@Query("SELECT p FROM Product p WHERE " + "LOWER(p.prodname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "('active' LIKE LOWER(CONCAT(:keyword, '%')) AND p.isActive = true) OR "
			+ "('inactive' LIKE LOWER(CONCAT(:keyword, '%')) AND p.isActive = false)")
	List<Product> searchProducts(@Param("keyword") String keyword);

	@Query("SELECT p FROM Product p WHERE " + "(:status = '' OR "
			+ "(LOWER(:status) IN ('active','true') AND p.isActive = true) OR "
			+ "(LOWER(:status) IN ('inactive','false') AND p.isActive = false)) " + "ORDER BY "
			+ "CASE WHEN :priceRange = 'low' THEN p.price END ASC, "
			+ "CASE WHEN :priceRange = 'high' THEN p.price END DESC")
	List<Product> filterProducts(@Param("status") String status, @Param("priceRange") String priceRange);

	List<Product> findByCategoryAndProdidNot(String category, Integer prodid);

	List<Product> findByCategory(String category);

    List<Product> findByProdidIn(List<Integer> prodIds);
}

package com.Karthikeya.ecommerce.product_service_Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Karthikeya.ecommerce.product_service_DTO.ProductDto;
import com.Karthikeya.ecommerce.product_service_Model.Product;
import com.Karthikeya.ecommerce.product_service_Repo.ProductRepo;

import jakarta.transaction.Transactional;

@Service
public class ProductService {
	@Autowired
	ProductRepo productRepo;
	private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/images/";

	public List<Product> getProducts() {
		return productRepo.findAll();
	}

	@Transactional
	public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
		// 🔥 create folder if not exists
		File uploadDir = new File(UPLOAD_DIR);
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}

		// 🔥 unique file name
		String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();

		Path filePath = Paths.get(UPLOAD_DIR + fileName);
		// 🔥 save file
		Files.write(filePath, imageFile.getBytes());

		// 🔥 save URL in DB
		product.setImageUrl("/images/" + fileName);
		return productRepo.save(product);
	}

	public Optional<Product> getProductById(int id) {
		if (!(productRepo.findById(id).toString().isEmpty())) {
			return productRepo.findById(id);
		}
		;
		return Optional.empty();
	}

	public ResponseEntity<Object> deleteAllProducts() {
		productRepo.deleteAll();
		;
		return ResponseEntity.noContent().build();

	}

	@Transactional
	public Product updateProduct(int id, Product updatedProduct) {
		return productRepo.findById(id).map(product -> {
			System.out.println("Before update - Existing creationDate: " + product.getCreationDate());
			System.out.println("Incoming update - New creationDate: " + updatedProduct.getCreationDate());
			product.setProdname(updatedProduct.getProdname());
			product.setPrice(updatedProduct.getPrice());
			product.setCreationDate(updatedProduct.getCreationDate());
			product.setActive(updatedProduct.isActive());
			product.setLastupdated(updatedProduct.getLastupdated());
			return productRepo.save(product);
		}).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
	}

	public void deleteProduct(int id) {
		if (!productRepo.existsById(id)) {
			throw new RuntimeException("Product not found with id: " + id);
		}
		productRepo.deleteById(id);
		;
	}

	@Transactional
	public List<Product> searchProducts(String keyword) {
		return productRepo.searchProducts(keyword);
	}

	@Transactional
	public List<Product> filterProducts(String status, String price) {
		return productRepo.filterProducts(status, price);
	}

	public List<Product> getComparisonOptions(Integer productId) {

		Product currentProduct = productRepo.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		return productRepo.findByCategoryAndProdidNot(currentProduct.getCategory(), productId);
	}

	public List<Product> getProductsByCategory(String category) {
		return productRepo.findByCategory(category);
	}

	public List<ProductDto> getProductsByIds(List<Integer> productIds) {

		List<Product> products = productRepo.findByProdidIn(productIds);

		return products.stream().map(product -> new ProductDto(product.getProdid(), product.getProdname(),
				product.getPrice(), product.getImageUrl())).toList();
	}
}

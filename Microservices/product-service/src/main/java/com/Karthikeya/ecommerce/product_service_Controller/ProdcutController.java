package com.Karthikeya.ecommerce.product_service_Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Karthikeya.ecommerce.product_service_DTO.ProductDto;
import com.Karthikeya.ecommerce.product_service_Model.Product;
import com.Karthikeya.ecommerce.product_service_Service.ProductService;

// Allow frontend to call backend
@RestController
@RequestMapping("/products")
public class ProdcutController {
	@Autowired
	ProductService service;

	@GetMapping("/getproducts")
	public List<Product> getproducts() {
		System.out.println("Inside the get products controller");
		return service.getProducts();
	}

	@PostMapping(value = "/addproduct", consumes = "multipart/form-data")
	public ResponseEntity<?> addProduct(@RequestPart Product product,
			@RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {

		try {
			if (imageFile == null) {
				return new ResponseEntity<>("No image file received", HttpStatus.BAD_REQUEST);
			}
			Product savedProduct = service.addProduct(product, imageFile);
			return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable int id) {

		return service.getProductById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/deleteallproducts")
	public ResponseEntity<String> deleteAllProducts() {
		service.deleteAllProducts();
		return ResponseEntity.ok("All products deleted successfully.");
	}

	@PutMapping("/updateproductbyid/{id}")
	public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody Product product) {
		System.out.println("Received from frontend - creationDate: " + product.getCreationDate());
		Product updatedProduct = service.updateProduct(id, product);
		return ResponseEntity.ok(updatedProduct);
	}

	@DeleteMapping("products/deleteproductbyid/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable int id) {
		service.deleteProduct(id);
		return ResponseEntity.ok("Product deleted successfully");

	}

	@GetMapping("/search")
	public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {

		List<Product> products = service.searchProducts(keyword);
		System.out.println("searching with " + keyword);
		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	@GetMapping("/filter")
	public ResponseEntity<List<Product>> filterProducts(@RequestParam(required = false) String status,
			@RequestParam(required = false) String price) {
		return ResponseEntity.ok(service.filterProducts(status, price));
	}

	@GetMapping("/comparison-options/{id}")
	public ResponseEntity<List<Product>> getComparisonOptions(@PathVariable Integer id) {

		return ResponseEntity.ok(service.getComparisonOptions(id));
	}

	@GetMapping("/category/{category}")
	public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {

		return ResponseEntity.ok(service.getProductsByCategory(category));
	}

	@PostMapping("/by-ids")
	public ResponseEntity<List<ProductDto>> getProductsByIds(@RequestBody List<Integer> productIds) {

		return ResponseEntity.ok(service.getProductsByIds(productIds));
	}
}

package com.example.ecommerce.controller;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.service.ProductService;
@CrossOrigin
@RestController
public class ProdcutController {
	    @Autowired
	    ProductService service;

	    @GetMapping("/products")
	    public List<Product> getproducts() {
	        return service.getProducts();
	    }

	    @PostMapping("/addproduct")
	    public ResponseEntity<String> addproduct(@RequestBody Product prod)
	    {
	        service.addproducts(prod);
	        return ResponseEntity.ok("Product added successfully");
	    }
	    @GetMapping("/products/{id}")
	    public Optional<Product> getproducts(@PathVariable int id) {
	        return service.getProductById(id);
	    }
	    @DeleteMapping("/deleteallproducts")
	    public ResponseEntity<String> deleteAllProducts() {
	        service.deleteAllProducts();
	        return ResponseEntity.ok("All products deleted successfully.");
	    }
	    @PutMapping("/updateproductbyid/{id}")
	    public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody Product product) {
	        Product updatedProduct = service.updateProduct(id, product);
	        return ResponseEntity.ok(updatedProduct);
	    }
	    @DeleteMapping("/deleteproductbyid/{id}")
	    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
	        service.deleteProduct(id);
	        return ResponseEntity.ok("Product deleted successfully");
	    }

}

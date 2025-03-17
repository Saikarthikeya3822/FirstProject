package com.example.ecommerce.service;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;

import com.example.ecommerce.ProductRepo;
import com.example.ecommerce.model.Product;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
@Service
public class ProductService {
	  @Autowired
	    ProductRepo productRepo;

	    public List<Product> getProducts() {
	        //return this.productRepo.findAll();
	        return productRepo.findAll();
	    }
	    @Transactional
	    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
	        product.setImageName(imageFile.getOriginalFilename());
	        product.setImageType(imageFile.getContentType());
	        product.setImageData(imageFile.getBytes());
	        return productRepo.save(product);
	    }

	    public Optional<Product> getProductById(int id) {
	        if (!(productRepo.findById(id).toString().isEmpty()))
	        {
	            return productRepo.findById(id);
	        };
	        return Optional.empty();
	    }
    
	    public ResponseEntity<Object> deleteAllProducts() {
	        productRepo.deleteAll();;
	        return ResponseEntity.noContent().build();

	    }
	    public Product updateProduct(int id, Product updatedProduct) {
	      return productRepo.findById(id).map(product->{
	         // product.setProdId(updatedProduct.getProdId());
	          product.setProdName(updatedProduct.getProdName());
	          product.setPrice(updatedProduct.getPrice());
	          product.setCreationDate(updatedProduct.getCreationDate());
	          product.setActive(updatedProduct.isActive());
	          product.setLastUpdated(updatedProduct.getLastUpdated());
	          return productRepo.save(product);
	      }).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
	    }
	    public void deleteProduct(int id) {
	        if (!productRepo.existsById(id)) {
	            throw new RuntimeException("Product not found with id: " + id);
	        }
	        productRepo.deleteById(id);;
	    }

}

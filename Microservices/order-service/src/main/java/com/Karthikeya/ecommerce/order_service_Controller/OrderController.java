package com.Karthikeya.ecommerce.order_service_Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Karthikeya.ecommerce.order_service_Model.Order;
import com.Karthikeya.ecommerce.order_service_Service.OrderService;


@RestController
@RequestMapping("/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

	@GetMapping("/getOrders")
	public Page<Order> getOrders(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size,
			@RequestParam(required = false) String filterType, @RequestParam(required = false) String filterValue) {
		return orderService.getOrders(page, size, filterType, filterValue);
	}
	@GetMapping("/all")
	public List<Order> getForAiAllOrders() {

	    return orderService.getForAiAllOrders();
	}
	@GetMapping("/filter-values")
	public List<String> getFilterValues(@RequestParam String type) {
		return orderService.getFilterValues(type);
	}

	@GetMapping("/{id}")
	public Order getOrderById(@PathVariable int id) {
		return orderService.getOrderById(id).orElseThrow(() -> new RuntimeException("Order not found"));
	}

	@PostMapping("/addOrder")
	public ResponseEntity<Integer> createOrder(@RequestBody Order order) {
		System.out.println("Order date:" + order.getOrderDate());
		try {
			Order savedOrder = orderService.createOrder(order);
			return ResponseEntity.ok(savedOrder.getOrderId()); // 200 OK
		} catch (Exception e) {
			e.printStackTrace(); // for logs

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 500 if failed
		}
	}

	@DeleteMapping("/{id}")
	public String deleteOrder(@PathVariable int id) {
		orderService.deleteOrder(id);
		return "Order deleted successfully!";
	}

}

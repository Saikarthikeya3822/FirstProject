package com.Karthikeya.ecommerce.order_service_Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.order_service_Model.Order;
import com.Karthikeya.ecommerce.order_service_Repo.OrderRepository;

@Service
public class OrderService {
	@Autowired
	private OrderRepository Orderrepo;

	public Page<Order> getAllOrders(int page, int size) {
		return Orderrepo.findAll(PageRequest.of(page, size));
	}

	public Page<Order> getOrders(int page, int size, String filterType, String filterValue) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("orderId").descending());
		if (filterType == null || filterValue == null) {
			return Orderrepo.findAll(pageable);
		}
		switch (filterType) {
		case "username":
			return Orderrepo.findByUsername(filterValue, pageable);
		case "state":
			return Orderrepo.findByState(filterValue, pageable);
		case "region":
			return Orderrepo.findByRegion(filterValue, pageable);
		case "orderDate":
			return Orderrepo.findByOrderDate(filterValue, pageable);
		default:
			return Orderrepo.findAll(pageable);
		}
	}

	public Optional<Order> getOrderById(int id) {
		return Orderrepo.findById(id);
	}

	public Order createOrder(Order order) {
		return Orderrepo.save(order);
	}

	public Order updateOrder(int id, Order updatedOrder) {
		return Orderrepo.findById(id).map(order -> {
			order.setUsername(updatedOrder.getUsername());
			order.setProductname(updatedOrder.getProductname());
			order.setState(updatedOrder.getState());
			order.setRegion(updatedOrder.getRegion());
			order.setStatus(updatedOrder.getStatus());
			order.setPrice(updatedOrder.getPrice());
			return Orderrepo.save(order);
		}).orElseThrow(() -> new RuntimeException("Order not found with id " + id));
	}

	public void deleteOrder(int id) {
		Orderrepo.deleteById(id);
	}

	public List<String> getFilterValues(String type) {

		switch (type) {
		case "username":
			return Orderrepo.findDistinctUsernames();
		case "state":
			return Orderrepo.findDistinctStates();
		case "region":
			return Orderrepo.findDistinctRegions();
		case "orderDate":
			return Orderrepo.findDistinctOrderDates();
		default:
			return List.of();
		}
	}

	public List<Order> getForAiAllOrders() {
		// TODO Auto-generated method stub

	    return Orderrepo.findAll();
	}

}

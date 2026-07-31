package com.Karthikeya.ecommerce.Ai_service_5_Tools;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import com.Karthikeya.ecommerce.Ai_service_2_Model.Order;
import com.Karthikeya.ecommerce.Ai_service_6_external_clients.OrderClient;
import com.Karthikeya.ecommerce.Ai_service_8_util.SecurityUtil;
@Service
public class AIOrderTool {

	private static final Logger logger = LoggerFactory.getLogger(AIOrderTool.class);

	private final OrderClient orderClient;
	private String token;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public AIOrderTool(OrderClient orderClient) {
		this.orderClient = orderClient;
	}

	@Tool(name = "getLatestOrders", description = """
			Fetch latest ecommerce orders
			for currently authenticated user
			""")
	public List<Order> getLatestOrders() {

		logger.info("Fetching latest orders");

		return orderClient.getAllOrders(token);
	}

	@Tool(name = "getMonthlySpending", description = """
			Calculate monthly ecommerce spending
			for authenticated user
			""")
	public BigDecimal getMonthlySpending(int month, int year) {

		String token = SecurityUtil.getTokenFromSecurityContext();

		List<Order> orders = orderClient.getAllOrders("Bearer " + token);

		BigDecimal total = orders.stream()

				.filter(order -> order.getOrderDate().getMonthValue() == month)

				.filter(order -> order.getOrderDate().getYear() == year)

				.map(Order::getPrice)

				.reduce(BigDecimal.ZERO, BigDecimal::add);

		logger.info("Monthly spending calculated={}", total);

		return total;
	}
}

package com.Karthikeya.ecommerce.order_service_Repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Karthikeya.ecommerce.order_service_Model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT DISTINCT o.username FROM Order o")
    List<String> findDistinctUsernames();

    @Query("SELECT DISTINCT o.state FROM Order o")
    List<String> findDistinctStates();

    @Query("SELECT DISTINCT o.region FROM Order o")
    List<String> findDistinctRegions();

    @Query("SELECT DISTINCT o.orderDate FROM Order o")
    List<String> findDistinctOrderDates();

    Page<Order> findByUsername(String username, Pageable pageable);

    Page<Order> findByState(String state, Pageable pageable);

    Page<Order> findByRegion(String region, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE DATE(o.orderDate) = :orderDate")
    Page<Order> findByOrderDate(@Param("orderDate") String orderDate, Pageable pageable);
}

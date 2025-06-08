package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class OrderService {

  private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

  @Autowired
  private OrderRepository orderRepository;

  public Order createOrder(Order order) {
    if (order == null || order.getUser() == null) {
      throw new IllegalArgumentException("Order or User cannot be null");
    }
    logger.info("Creating order for user: {}", order.getUser().getId());
    return orderRepository.save(order);
  }

  public List<Order> getOrdersByUserId(Long userId) {
    if (userId == null) {
      throw new IllegalArgumentException("User ID cannot be null");
    }
    logger.info("Fetching orders for user ID: {}", userId);
    return orderRepository.findByUserId(userId);
  }

  public Order getOrderById(Long orderId) {
    if (orderId == null) {
      throw new IllegalArgumentException("Order ID cannot be null");
    }
    logger.info("Fetching order ID: {}", orderId);
    return orderRepository.findById(orderId).orElseThrow(() -> {
      logger.error("Order not found for ID: {}", orderId);
      return new RuntimeException("Order not found");
    });
  }

  public void deleteOrder(Long orderId) {
    if (orderId == null) {
      throw new IllegalArgumentException("Order ID cannot be null");
    }
    logger.info("Deleting order ID: {}", orderId);
    orderRepository.deleteById(orderId);
  }
}

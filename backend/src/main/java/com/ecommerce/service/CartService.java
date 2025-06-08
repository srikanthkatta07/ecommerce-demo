package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CartService {

  private static final Logger logger = LoggerFactory.getLogger(CartService.class);

  @Autowired
  private CartRepository cartRepository;

  public Cart createCart(Cart cart) {
    if (cart == null || cart.getUser() == null) {
      throw new IllegalArgumentException("Cart or User cannot be null");
    }
    logger.info("Creating cart for user: {}", cart.getUser().getId());
    return cartRepository.save(cart);
  }

  public Cart getCartByUserId(Long userId) {
    if (userId == null) {
      throw new IllegalArgumentException("User ID cannot be null");
    }
    logger.info("Fetching cart for user ID: {}", userId);
    return cartRepository.findById(userId).orElseThrow(() -> {
      logger.error("Cart not found for user ID: {}", userId);
      return new RuntimeException("Cart not found");
    });
  }

  public Cart updateCart(Long cartId, Cart updatedCart) {
    if (cartId == null || updatedCart == null) {
      throw new IllegalArgumentException("Cart ID or updated cart cannot be null");
    }
    logger.info("Updating cart ID: {}", cartId);
    Cart cart = cartRepository.findById(cartId).orElseThrow(() -> {
      logger.error("Cart not found for ID: {}", cartId);
      return new RuntimeException("Cart not found");
    });
    cart.setItems(updatedCart.getItems());
    return cartRepository.save(cart);
  }

  public void deleteCart(Long cartId) {
    if (cartId == null) {
      throw new IllegalArgumentException("Cart ID cannot be null");
    }
    logger.info("Deleting cart ID: {}", cartId);
    cartRepository.deleteById(cartId);
  }
}

package com.ecommerce.controller;

import com.ecommerce.model.Cart;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

  @Autowired
  private CartService cartService;

  @PostMapping
  public ResponseEntity<Cart> createCart(@RequestBody Cart cart) {
    return ResponseEntity.ok(cartService.createCart(cart));
  }

  @GetMapping("/{userId}")
  public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
    return ResponseEntity.ok(cartService.getCartByUserId(userId));
  }

  @PutMapping("/{cartId}")
  public ResponseEntity<Cart> updateCart(@PathVariable Long cartId, @RequestBody Cart cart) {
    return ResponseEntity.ok(cartService.updateCart(cartId, cart));
  }

  @DeleteMapping("/{cartId}")
  public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
    cartService.deleteCart(cartId);
    return ResponseEntity.noContent().build();
  }
}

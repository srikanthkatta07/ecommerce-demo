package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User user) {
    user.setRole("USER"); // Ensure role is always set to USER
    return ResponseEntity.ok(userService.registerUser(user));
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
    String token = userService.loginUser(user);
    Map<String, String> response = new HashMap<>();
    response.put("token", token);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/validate-token")
  public ResponseEntity<Map<String, String>> validateToken(@RequestHeader("Authorization") String token) {
    String role = userService.validateToken(token);
    Map<String, String> response = new HashMap<>();
    response.put("role", role);
    return ResponseEntity.ok(response);
  }
}

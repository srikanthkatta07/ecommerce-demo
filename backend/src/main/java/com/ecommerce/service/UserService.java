package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.time.LocalDateTime;

@Service
public class UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserService.class);
  private static final String SECRET_KEY = "your_secret_key";

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  public User registerUser(@Valid User user) {
    try {
      logger.info("Registering user: {}", user.getUsername());
      user.setPasswordHash(passwordEncoder.encode(user.getRawPassword()));
      user.setCreatedAt(LocalDateTime.now());
      return userRepository.save(user);
    } catch (Exception e) {
      logger.error("Error registering user: {}", e.getMessage());
      throw new RuntimeException("Failed to register user", e);
    }
  }

  public String loginUser(@Valid User user) {
    try {
      logger.info("Logging in user: {}", user.getUsername());
      User existingUser = userRepository.findByUsername(user.getUsername());
      if (existingUser == null || !passwordEncoder.matches(user.getRawPassword(), existingUser.getPasswordHash())) {
        throw new RuntimeException("Invalid username or password");
      }

      // Generate JWT token with role
      String token = Jwts.builder()
          .setSubject(existingUser.getUsername())
          .claim("role", existingUser.getRole())
          .setIssuedAt(new Date())
          .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
          .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
          .compact();

      return token;
    } catch (Exception e) {
      logger.error("Error logging in user: {}", e.getMessage());
      throw new RuntimeException("Failed to log in user", e);
    }
  }

  public String validateToken(String token) {
    try {
      return Jwts.parser()
          .setSigningKey(SECRET_KEY)
          .parseClaimsJws(token.replace("Bearer ", ""))
          .getBody()
          .get("role", String.class);
    } catch (Exception e) {
      logger.error("Error validating token: {}", e.getMessage());
      throw new RuntimeException("Invalid token", e);
    }
  }
}

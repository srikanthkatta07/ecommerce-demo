package com.ecommerce.model;

import javax.persistence.*;

@Entity
@Table(name = "images")
public class Image {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String url;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  // Getters and setters
}

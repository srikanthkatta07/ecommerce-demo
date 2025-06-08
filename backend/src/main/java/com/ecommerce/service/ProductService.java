package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.amazonaws.services.s3.AmazonS3;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ProductService {

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private AmazonS3 amazonS3;

  @Value("${aws.s3.bucket-name}")
  private String bucketName;

  private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

  public Product createProduct(Product product) {
    logger.info("Creating product with documentId: {}", product.getDocumentId());
    return productRepository.save(product);
  }

  public List<Product> getAllProducts() {
    return productRepository.findAll();
  }

  public Product getProductById(Long id) {
    Optional<Product> product = productRepository.findById(id);
    return product.orElseThrow(() -> new RuntimeException("Product not found"));
  }

  public Product updateProduct(Long id, Product updatedProduct) {
    Product product = getProductById(id);
    product.setName(updatedProduct.getName());
    product.setPrice(updatedProduct.getPrice());
    product.setCategoryId(updatedProduct.getCategoryId());
    return productRepository.save(product);
  }

  public void deleteProduct(Long id) {
    productRepository.deleteById(id);
  }

  public String generateS3PresignedUrl(Long id, String fileName, String fileType, String mimeType) {
    try {
      // Set the expiration time for the presigned URL (e.g., 15 minutes)
      java.util.Date expiration = new java.util.Date();
      long expTimeMillis = expiration.getTime();
      expTimeMillis += 1000 * 60 * 15;
      expiration.setTime(expTimeMillis);

      // Generate the presigned URL for PUT operation
      com.amazonaws.services.s3.model.GeneratePresignedUrlRequest generatePresignedUrlRequest = new com.amazonaws.services.s3.model.GeneratePresignedUrlRequest(
          bucketName, String.valueOf(id))
          .withMethod(com.amazonaws.HttpMethod.PUT)
          .withExpiration(expiration);
      generatePresignedUrlRequest.addRequestParameter("Content-Type", mimeType);

      java.net.URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
      return url.toString();
    } catch (Exception e) {
      throw new RuntimeException("Failed to generate presigned URL for S3", e);
    }
  }

  public String generateS3PresignedUrl(String documentId) {
    try {
      // Generate presigned URL for the documentId
      java.util.Date expiration = new java.util.Date();
      long expTimeMillis = expiration.getTime();
      expTimeMillis += 1000 * 60 * 15; // 15 minutes expiration
      expiration.setTime(expTimeMillis);

      com.amazonaws.services.s3.model.GeneratePresignedUrlRequest generatePresignedUrlRequest = new com.amazonaws.services.s3.model.GeneratePresignedUrlRequest(
          bucketName, documentId)
          .withMethod(com.amazonaws.HttpMethod.GET)
          .withExpiration(expiration);

      java.net.URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
      return url.toString();
    } catch (Exception e) {
      throw new RuntimeException("Failed to generate presigned URL for S3", e);
    }
  }

  public Product saveProduct(Product product) {
    logger.info("Product details - ID: {}, Name: {}, Price: {}, CategoryId: {}, DocumentId: {}",
        product.getId(), product.getName(), product.getPrice(), product.getCategoryId(), product.getDocumentId());
    return productRepository.save(product);
  }

  public List<Product> getProductsByCategoryId(Long categoryId) {
    return productRepository.findByCategoryId(categoryId);
  }
}

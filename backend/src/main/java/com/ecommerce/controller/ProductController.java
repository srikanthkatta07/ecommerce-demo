package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Add this import if Document exists in your model package
import com.ecommerce.model.Document;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.AmazonS3;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.UUID;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
public class ProductController {

  @Autowired
  private ProductService productService;

  @Autowired
  private AmazonS3 amazonS3;

  @Autowired
  private com.ecommerce.service.DocumentService documentService;

  // @PostMapping
  // public ResponseEntity<Product> createProduct(@RequestBody Product product) {
  // return ResponseEntity.ok(productService.createProduct(product));
  // }

  @GetMapping
  public ResponseEntity<List<Product>> getAllProducts(@RequestParam(required = false) Long categoryId) {
    List<Product> products;
    if (categoryId != null) {
      products = productService.getProductsByCategoryId(categoryId);
    } else {
      products = productService.getAllProducts();
    }

    products.forEach(product -> {
      String bucketName = "springbootecommercedemo"; // Replace with actual bucket name
      Date expiration = new Date(System.currentTimeMillis() + 3600000); // 1 hour

      GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(
          bucketName,
          product.getImageKey())
          .withMethod(HttpMethod.GET)
          .withExpiration(expiration);
      URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
      product.setImageUrl(url.toString());
    });

    return ResponseEntity.ok(products);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Product> getProductById(@PathVariable Long id) {
    return ResponseEntity.ok(productService.getProductById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
    return ResponseEntity.ok(productService.updateProduct(id, product));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
  }

  // DTO for image upload
  public static class ImageUploadRequest {
    private String fileName;
    private String fileType;
    private String mimeType;
    private String file; // Base64 encoded file content

    // Getters and setters

    public String getFileName() {
      return fileName;
    }

    public void setFileName(String fileName) {
      this.fileName = fileName;
    }

    public String getFileType() {
      return fileType;
    }

    public void setFileType(String fileType) {
      this.fileType = fileType;
    }

    public String getMimeType() {
      return mimeType;
    }

    public void setMimeType(String mimeType) {
      this.mimeType = mimeType;
    }

    public String getFile() {
      return file;
    }

    public void setFile(String file) {
      this.file = file;
    }
  }

  // region S3 Presigned URL

  @PostMapping("/s3/presigned-url")
  public ResponseEntity<Map<String, Object>> getPresignedUrlWithDocument(@RequestParam String fileName) {
    String bucketName = "springbootecommercedemo"; // Replace with actual bucket name
    Date expiration = new Date(System.currentTimeMillis() + 3600000); // 1 hour

    // Generate a UUID for the document
    UUID documentId = UUID.randomUUID();

    // Create a new Document with the generated UUID
    Document document = new Document();
    document.setId(documentId);
    document.setStatus("PENDING");
    document.setUrl(""); // Will set after generating presigned URL

    // Generate the presigned URL using the UUID as the object key
    GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(
        bucketName,
        documentId.toString())
        .withMethod(HttpMethod.PUT)
        .withExpiration(expiration);
    URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

    // Set the presigned URL in the document (optional)
    document.setUrl(url.toString());

    // Save the document in the database
    documentService.saveDocument(document);

    Map<String, Object> response = new HashMap<>();
    response.put("presignedUrl", url.toString());
    response.put("documentId", documentId.toString());

    return ResponseEntity.ok(response);
  }

  // endregion

  @PutMapping("/documents/{id}/mark-done")
  public ResponseEntity<Void> markDocumentAsDone(@PathVariable Long id) {
    documentService.updateDocumentStatus(id, "DONE");
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/create")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Product> createProduct(@RequestBody Product product) {
    // Validate categoryId, documentId, and stock
    if (product.getCategoryId() == null || product.getDocumentId() == null || product.getStock() == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    Product createdProduct = productService.saveProduct(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
  }

  // DTO for creating a product
  public static class ProductCreateRequest {
    private Long categoryId;
    private String documentId;
    private String name;
    private String price;
    private Integer stock;

    // Getters and setters

    public Long getCategoryId() {
      return categoryId;
    }

    public void setCategoryId(Long categoryId) {
      this.categoryId = categoryId;
    }

    public String getDocumentId() {
      return documentId;
    }

    public void setDocumentId(String documentId) {
      this.documentId = documentId;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getPrice() {
      return price;
    }

    public void setPrice(String price) {
      this.price = price;
    }

    public Integer getStock() {
      return stock;
    }

    public void setStock(Integer stock) {
      this.stock = stock;
    }
  }

  @PostMapping("/admin/create-product")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Product> createProductByAdmin(@RequestBody ProductCreateRequest request) {
    Product product = new Product();
    product.setCategoryId(request.getCategoryId());
    product.setDocumentId(UUID.fromString(request.getDocumentId())); // Convert documentId from string to UUID
    product.setName(request.getName());
    product.setPrice(new BigDecimal(request.getPrice()));
    product.setStock(request.getStock());

    Product createdProduct = productService.createProduct(product);

    // Generate presigned URL for the image
    String imageUrl = productService.generateS3PresignedUrl(createdProduct.getDocumentId().toString());
    createdProduct.setImageUrl(imageUrl); // Set the image URL inside the product

    return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
  }

  @GetMapping("/{id}/image-url")
  public ResponseEntity<String> getProductImageUrl(@PathVariable Long id) {
    Product product = productService.getProductById(id);
    String presignedUrl = productService.generateS3PresignedUrl(product.getDocumentId().toString());
    return ResponseEntity.ok(presignedUrl);
  }
}

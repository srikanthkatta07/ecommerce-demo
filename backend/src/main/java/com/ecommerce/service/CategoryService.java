package com.ecommerce.service;

import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Service
public class CategoryService {

  private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

  @Autowired
  private CategoryRepository categoryRepository;

  public Category createCategory(@Valid Category category) {
    try {
      logger.info("Creating category: {}", category.getName());
      return categoryRepository.save(category);
    } catch (Exception e) {
      logger.error("Error creating category: {}", e.getMessage());
      throw new RuntimeException("Failed to create category", e);
    }
  }

  public List<Category> getAllCategories() {
    try {
      logger.info("Fetching all categories");
      return categoryRepository.findAll();
    } catch (Exception e) {
      logger.error("Error fetching categories: {}", e.getMessage());
      throw new RuntimeException("Failed to fetch categories", e);
    }
  }

  public Category getCategoryById(@NotNull Long id) {
    try {
      logger.info("Fetching category by ID: {}", id);
      return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    } catch (Exception e) {
      logger.error("Error fetching category by ID {}: {}", id, e.getMessage());
      throw new RuntimeException("Failed to fetch category", e);
    }
  }

  public Category updateCategory(@NotNull Long id, @Valid Category updatedCategory) {
    try {
      logger.info("Updating category with ID: {}", id);
      Category category = getCategoryById(id);
      category.setName(updatedCategory.getName());
      return categoryRepository.save(category);
    } catch (Exception e) {
      logger.error("Error updating category with ID {}: {}", id, e.getMessage());
      throw new RuntimeException("Failed to update category", e);
    }
  }

  public void deleteCategory(@NotNull Long id) {
    try {
      logger.info("Deleting category with ID: {}", id);
      categoryRepository.deleteById(id);
    } catch (Exception e) {
      logger.error("Error deleting category with ID {}: {}", id, e.getMessage());
      throw new RuntimeException("Failed to delete category", e);
    }
  }
}

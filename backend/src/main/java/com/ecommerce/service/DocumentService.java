package com.ecommerce.service;

import com.ecommerce.model.Document;
import com.ecommerce.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {

  @Autowired
  private DocumentRepository documentRepository;

  public Document saveDocument(Document document) {
    return documentRepository.save(document);
  }

  public void updateDocumentStatus(Long id, String status) {
    Document document = documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
    document.setStatus(status);
    document.setUpdatedAt(java.time.LocalDateTime.now());
    documentRepository.save(document);
  }
}

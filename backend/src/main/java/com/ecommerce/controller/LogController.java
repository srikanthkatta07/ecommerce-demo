package com.ecommerce.controller;

import com.ecommerce.model.Log;
import com.ecommerce.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

  @Autowired
  private LogService logService;

  @GetMapping
  public ResponseEntity<List<Log>> getAllLogs() {
    return ResponseEntity.ok(logService.getAllLogs());
  }

  @PostMapping
  public ResponseEntity<Log> createLog(@RequestBody Log log) {
    return ResponseEntity.ok(logService.createLog(log));
  }
}

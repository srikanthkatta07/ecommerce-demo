package com.ecommerce.service;

import com.ecommerce.model.Log;
import com.ecommerce.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

  @Autowired
  private LogRepository logRepository;

  public List<Log> getAllLogs() {
    return logRepository.findAll();
  }

  public Log createLog(Log log) {
    return logRepository.save(log);
  }
}

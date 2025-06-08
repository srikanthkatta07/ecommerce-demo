package com.ecommerce.util;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.postgresql.util.PGobject;
import java.util.List;

@Converter(autoApply = false)
public class JsonListConverter implements AttributeConverter<List<String>, Object> {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public Object convertToDatabaseColumn(List<String> attribute) {
    org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(JsonListConverter.class);
    logger.debug("Converting list to JSONB: {}", attribute);
    if (attribute == null || attribute.isEmpty()) {
      return null; // Handle null or empty list
    }
    try {
      System.out.println("Converting list to JSONB: " + attribute.get(0));
      PGobject jsonObject = new PGobject();
      jsonObject.setType("jsonb");
      jsonObject.setValue(objectMapper.writeValueAsString(attribute));
      return jsonObject;
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to convert list to JSONB", e);
    }
  }

  @Override
  public List<String> convertToEntityAttribute(Object dbData) {
    if (dbData == null) {
      return List.of(); // Return empty list for null data
    }
    try {
      String json;
      if (dbData instanceof PGobject) {
        json = ((PGobject) dbData).getValue();
      } else if (dbData instanceof String) {
        json = (String) dbData; // Handle string representation of JSON array
      } else {
        json = dbData.toString();
      }
      return objectMapper.readValue(json, new TypeReference<List<String>>() {
      });
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to convert JSONB to list", e);
    }
  }
}

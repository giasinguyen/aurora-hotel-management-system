package com.aurora.backend.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Spring Converter to convert String to Map for form data binding
 */
@Component
public class StringToMapConverter implements Converter<String, Map<String, Object>> {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public Map<String, Object> convert(String source) {
        try {
            return objectMapper.readValue(source, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid JSON string for Map conversion: " + e.getMessage(), e);
        }
    }
}

package com.aurora.backend.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

/**
 * Custom deserializer that handles both JSON string and JSON object for Map fields
 */
public class FlexibleMapDeserializer extends JsonDeserializer<Map<String, Object>> {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public Map<String, Object> deserialize(JsonParser p, DeserializationContext ctxt) 
            throws IOException, JsonProcessingException {
        
        if (p.currentToken().isScalarValue()) {
            // It's a string, parse it
            String jsonString = p.getText();
            return objectMapper.readValue(jsonString, Map.class);
        } else {
            // It's already an object, read it normally
            return objectMapper.readValue(p, Map.class);
        }
    }
}

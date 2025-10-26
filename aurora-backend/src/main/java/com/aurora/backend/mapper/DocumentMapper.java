package com.aurora.backend.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.document.Document;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;


@Component
public class DocumentMapper implements RowMapper<Document> {
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public Document mapRow(ResultSet rs, int rowNum) throws SQLException {
        return null;
    }
}

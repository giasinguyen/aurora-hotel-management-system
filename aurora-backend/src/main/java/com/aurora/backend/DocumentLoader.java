package com.aurora.backend;

import com.aurora.backend.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DocumentLoader implements CommandLineRunner {

    private final DocumentRepository documentRepository;
    private final Logger logger = LoggerFactory.getLogger(DocumentLoader.class);

    @Override
    public void run(String... args) throws Exception {

    }
}

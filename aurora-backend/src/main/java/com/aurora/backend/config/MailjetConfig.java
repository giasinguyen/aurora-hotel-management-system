package com.aurora.backend.config;

import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class MailjetConfig {

    @Value("${mailjet.api-key}")
    private String apiKey;

    @Value("${mailjet.secret-key}")
    private String secretKey;

    @Value("${mailjet.from-email}")
    private String fromEmail;

    @Value("${mailjet.from-name}")
    private String fromName;

    @Bean
    public MailjetClient mailjetClient() {
        ClientOptions options = ClientOptions.builder()
                .apiKey(apiKey)
                .apiSecretKey(secretKey)
                .build();
        return new MailjetClient(options);
    }
}

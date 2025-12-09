package com.aurora.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private static final String[] PUBLIC_POST_ENDPOINTS = {
            // Auth endpoints - Session management with Redis
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/logout",
            "/api/v1/auth/refresh-token",
            "/api/v1/auth/refresh",

            // Password reset endpoints - PUBLIC for forgot/reset password
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",

            // Email verification endpoints - PUBLIC
            "/api/v1/auth/verify-email",
            "/api/v1/auth/resend-verification-email",

            // RAG chatbot
            "/api/v1/rag/**",

            // Room availability - PUBLIC for availability check
            "/api/v1/room-availability/check-multiple",

            // Booking checkout - PUBLIC for customers and walk-in guests
            "/api/v1/bookings/checkout",

            // VNPay payment creation - PUBLIC for guest checkout
            "/api/v1/payments/vnpay/create",

            // VNPay IPN callback - MUST be public for VNPay server-to-server callback
            "/api/v1/payments/vnpay/ipn",

            // Cloudinary upload endpoints
            "/api/v1/cloudinary/upload",
            "/api/v1/cloudinary/upload-multiple",
            // Test endpoints - For testing purposes only (remove in production)
            "/api/v1/test/**"
    };
    private static final String[] PUBLIC_GET_ENDPOINTS = {
            "/api/v1/test/**",
            "/actuator/**",
            "/api/v1/branches/**",
            "/api/v1/rooms/search",
            "/api/v1/rooms/{id}",
            "/api/v1/rooms/room-type/**",
            "/api/v1/room-types/**",
            "/api/v1/room-categories/**",
            "/api/v1/promotions/**",
            "/api/v1/services/**",
            "/api/v1/service-categories/**",
            "/api/v1/facilities/**",
            "/api/v1/amenities/**",
            "/api/v1/rag/**",
            "/api/v1/news/public/**",
            "/api/v1/payments/vnpay/return",

            // Cloudinary test endpoint
            "/api/v1/cloudinary/test",

            // Room availability - PUBLIC for checking availability
            "/api/v1/room-availability/check/**",
            "/api/v1/room-availability/find-available/**",
            "/api/v1/room-availability/calendar/**",
            "/api/v1/room-availability/count-available/**",

            // Booking public endpoints - For guest booking lookup
            "/api/v1/bookings/public/**",
            "/api/v1/health",
            "/api/v1/ping",
    };
    private final CustomJwtDecoder customJwtDecoder;
    private final CustomJwtAuthenticationConverter customJwtAuthenticationConverter;
    
    @Value("${ALLOWED_ORIGINS:}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request -> request
                .requestMatchers("/ws/rag/stream").permitAll()
                .requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/v1/document/**").permitAll() // TODO: Delete this in production
                .requestMatchers(HttpMethod.DELETE, "/api/v1/document/**").permitAll() // TODO: Delete this in production
                .requestMatchers(HttpMethod.DELETE, "/api/v1/test/**").permitAll() // Test cleanup endpoint
                .requestMatchers(HttpMethod.DELETE, "/api/v1/cloudinary/delete/**").permitAll() // Cloudinary delete endpoint
                .requestMatchers(HttpMethod.GET, "/api/v1/cloudinary/optimize/**").permitAll() // Cloudinary optimize endpoint
                .anyRequest().authenticated());

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(customJwtAuthenticationConverter))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                .accessDeniedHandler(new JwtAccessDeniedHandler()));

        http.csrf(AbstractHttpConfigurer::disable);

        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Default allowed origins
        List<String> origins = new ArrayList<>(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
                "http://127.0.0.1:3002",
                "http://127.0.0.1:5173"
        ));
        
        // Add extra origins from environment variable
        if (allowedOrigins != null && !allowedOrigins.trim().isEmpty()) {
            String[] extraOrigins = allowedOrigins.split(",");
            for (String origin : extraOrigins) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty()) {
                    origins.add(trimmed);
                }
            }
        }
        
        configuration.setAllowedOrigins(origins);

        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Max age for preflight requests
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


//    @Bean
//    JwtAuthenticationConverter jwtAuthenticationConverter() {
//        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
//        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
//
//        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
//        authenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
//
//        return authenticationConverter;
//    }

}

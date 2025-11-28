package com.aurora.backend.config;

import com.aurora.backend.entity.User;
import com.aurora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AbstractAuthenticationToken convert(Jwt jwt) {
        // Lấy username từ JWT claim
        String username = jwt.getClaim("sub");

        log.info("Converting JWT for user: {}", username);

        // Load user và permissions từ database
        Set<GrantedAuthority> authorities = new HashSet<>();

        try {
            User user = userRepository.findByUsernameWithPermissions(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            // Chuyển đổi permissions thành GrantedAuthority
            authorities = user.getRoles().stream()
                    .flatMap(role -> role.getPermissions().stream())
                    .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                    .collect(Collectors.toSet());

            log.info("Loaded {} permissions for user {}: {}",
                    authorities.size(),
                    username,
                    authorities.stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.joining(", ")));

        } catch (Exception e) {
            log.error("Error loading permissions for user {}: {}", username, e.getMessage());
        }

        return new JwtAuthenticationToken(jwt, authorities);
    }
}
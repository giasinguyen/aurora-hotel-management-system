package com.aurora.backend.config;

import com.aurora.backend.entity.SessionMeta;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Redis configuration for session management and caching
 */
@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    /**
     * Redis connection factory
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration serverConfig =
                new RedisStandaloneConfiguration(redisHost, redisPort);

        if (redisPassword != null && !redisPassword.isBlank()) {
            serverConfig.setPassword(RedisPassword.of(redisPassword));
        }

        return new LettuceConnectionFactory(serverConfig);
    }

    /**
     * RedisTemplate for SessionMeta operations
     */
    @Bean
    public RedisTemplate<String, SessionMeta> redisSessionMetaTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, SessionMeta> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // KEY serializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // VALUE serializer
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        Jackson2JsonRedisSerializer<SessionMeta> valueSerializer =
                new Jackson2JsonRedisSerializer<>(objectMapper, SessionMeta.class);

        template.setValueSerializer(valueSerializer);
        template.setHashValueSerializer(valueSerializer);

        template.afterPropertiesSet();
        return template;
    }

    /**
     * Cache configuration with TTL
     */
    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(15))
                .disableCachingNullValues();
    }

    /**
     * Redis cache manager for Spring Cache annotations
     */
    @Bean
    public RedisCacheManager cacheManager(
            RedisConnectionFactory factory,
            RedisCacheConfiguration cacheConfiguration) {
        return RedisCacheManager.builder(factory)
                .cacheDefaults(cacheConfiguration)
                .transactionAware()
                .build();
    }
}


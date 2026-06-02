package com.klef.resumedetector.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:resumeDetectorSecretKey12345678901234567890}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    public String getSecret() { return secret; }

    public long getExpiration() { return expiration; }
}
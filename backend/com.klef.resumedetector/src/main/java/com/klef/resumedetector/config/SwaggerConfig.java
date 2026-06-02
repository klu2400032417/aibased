package com.klef.resumedetector.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI resumeDetectorOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("AI Resume Detector API")
                .description("TCS Placement Project — Resume parsing & job-fit scoring")
                .version("v1.0")
                .contact(new Contact()
                    .name("Your Name")
                    .email("your.email@klef.ac.in")))
            .addSecurityItem(new SecurityRequirement()
                .addList("Bearer Auth"))
            .components(new Components()
                .addSecuritySchemes("Bearer Auth",
                    new SecurityScheme()
                        .name("Bearer Auth")
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}

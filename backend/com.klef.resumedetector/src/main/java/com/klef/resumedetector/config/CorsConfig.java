// package com.klef.resumedetector.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
// import org.springframework.web.filter.CorsFilter;

// import java.util.List;

// @Configuration
// public class CorsConfig {

//     @Bean
//     public CorsFilter corsFilter() {
//         CorsConfiguration config = new CorsConfiguration();

//         // allow React frontend origin
//         config.setAllowedOrigins(List.of(
//         		  "http://localhost:3000",
//         	        "http://localhost:3002",
//         	        "http://localhost:5173",
//         	        "http://localhost:5174",
//              "https://resumedetector-rouge.vercel.app"
//         ));

//         // allow these HTTP methods
//         config.setAllowedMethods(List.of(
//                 "GET", "POST", "PUT", "DELETE", "OPTIONS"
//         ));

//         // allow these headers
//         config.setAllowedHeaders(List.of(
//                 "Authorization",
//                 "Content-Type",
//                 "Accept"
//         ));

//         // allow JWT token in Authorization header
//         config.setAllowCredentials(true);

//         // apply CORS config to all endpoints
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", config);

//         return new CorsFilter(source);
//     }
// }

package com.klef.resumedetector.controller;

import com.klef.resumedetector.dto.AuthRequestDto;
import com.klef.resumedetector.dto.AuthResponseDto;
import com.klef.resumedetector.dto.RegisterRequestDto;
import com.klef.resumedetector.dto.ApiResponseDto;
import com.klef.resumedetector.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login and Register APIs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponseDto<AuthResponseDto>> login(
            @RequestBody AuthRequestDto request) {
        AuthResponseDto response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponseDto.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponseDto<AuthResponseDto>> register(
            @RequestBody RegisterRequestDto request) {
        AuthResponseDto response = authService.register(request);
        return ResponseEntity.ok(
                ApiResponseDto.success("Registration successful", response));
    }
}
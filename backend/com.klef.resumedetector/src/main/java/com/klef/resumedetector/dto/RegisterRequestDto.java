package com.klef.resumedetector.dto;

import lombok.Data;

@Data
public class RegisterRequestDto {

    private String name;
    private String email;
    private String password;
    private String role; // ADMIN, RECRUITER, CANDIDATE
}
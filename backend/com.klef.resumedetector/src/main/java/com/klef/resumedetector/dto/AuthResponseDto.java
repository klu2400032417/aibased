package com.klef.resumedetector.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
	 private Long id;      
    private String token;
    private String name;
    private String role;
}
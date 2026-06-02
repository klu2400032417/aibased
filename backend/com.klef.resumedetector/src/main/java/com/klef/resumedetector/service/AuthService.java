package com.klef.resumedetector.service;

import com.klef.resumedetector.dto.AuthRequestDto;
import com.klef.resumedetector.dto.AuthResponseDto;
import com.klef.resumedetector.dto.RegisterRequestDto;

public interface AuthService {

    AuthResponseDto login(AuthRequestDto request);

    AuthResponseDto register(RegisterRequestDto request);
}
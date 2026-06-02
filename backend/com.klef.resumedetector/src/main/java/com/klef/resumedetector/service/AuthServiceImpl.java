package com.klef.resumedetector.service;

import com.klef.resumedetector.dto.AuthRequestDto;
import com.klef.resumedetector.dto.AuthResponseDto;
import com.klef.resumedetector.dto.RegisterRequestDto;
import com.klef.resumedetector.entity.User;
import com.klef.resumedetector.repository.UserRepository;
import com.klef.resumedetector.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthResponseDto login(AuthRequestDto request) {
        // authenticate username + password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // generate JWT token
        String token = jwtTokenProvider.generateToken(authentication);

        // fetch user details
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponseDto(user.getId(), token, user.getName(), user.getRole().name());
    }

    @Override
    public AuthResponseDto register(RegisterRequestDto request) {
        // check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // build new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));

        userRepository.save(user);

        // auto-login after register
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtTokenProvider.generateToken(authentication);
        return new AuthResponseDto(user.getId(), token, user.getName(), user.getRole().name());
    }
}
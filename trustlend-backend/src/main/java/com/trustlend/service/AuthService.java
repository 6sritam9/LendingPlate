package com.trustlend.service;

import com.trustlend.dto.AuthResponse;
import com.trustlend.dto.LoginRequest;
import com.trustlend.dto.RegisterRequest;
import com.trustlend.entity.User;
import com.trustlend.exception.ConflictException;
import com.trustlend.repository.UserRepository;
import com.trustlend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .neighborhood(request.getNeighborhood())
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);

        return AuthResponse.builder()
                .token(token)
                .expiresIn(jwtUtil.getExpirationMs())
                .userId(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User vanished after authentication"));

        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .expiresIn(jwtUtil.getExpirationMs())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}

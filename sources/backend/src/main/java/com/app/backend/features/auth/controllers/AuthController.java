package com.app.backend.features.auth.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.auth.dtos.LoginDto;
import com.app.backend.features.auth.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse.Success<LoginDto.Response>> loginController(@Valid @RequestBody LoginDto.Request request) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Login successfully", authService.loginService(request))
        );
    }
}

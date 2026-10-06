package com.app.backend.features.auth.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.auth.services.AccountService;
import com.app.backend.security.token.JwtClaim;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse.Success<JsonNode>> meController(@AuthenticationPrincipal JwtClaim claim) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get account info successfully", accountService.getMeService(claim)));
    }
}

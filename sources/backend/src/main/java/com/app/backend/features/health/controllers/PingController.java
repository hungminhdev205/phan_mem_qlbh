package com.app.backend.features.health.controllers;

import com.app.backend.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PingController {
    @GetMapping("/v1/health/ping")
    public ResponseEntity<ApiResponse.Success<?>> getPingController () {
        return ResponseEntity.ok(ApiResponse.Success.ok("Pong", null));
    }
}

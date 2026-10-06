package com.app.backend.features.auth.dtos;

import jakarta.validation.constraints.NotBlank;

public class LoginDto {
    public record Request(
            @NotBlank(message = "{validation.auth.username.required}")
            String username,

            @NotBlank(message = "{validation.auth.password.required}")
            String password
    ) {}

    public record Response(
            String token
    ) {}
}

package com.app.backend.security.token;

import java.util.UUID;

public record JwtClaim(
        Long accountId,
        String username,
        UUID accountUuid
) {
}

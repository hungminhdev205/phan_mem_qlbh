package com.app.backend.security.token;

import com.app.backend.configs.JwtProperties;
import com.app.backend.entities.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import javax.crypto.SecretKey;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateToken(Account account) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusMillis(Long.parseLong(jwtProperties.getExpiration()));

        return Jwts.builder()
                .subject(account.getUsername())
                .claim("accountId", account.getId())
                .claim("accountUuid", account.getUuid().toString())
                .issuer(jwtProperties.getIssuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(secretKey())
                .compact();
    }

    public Optional<JwtClaim> parseToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey())
                    .requireIssuer(jwtProperties.getIssuer())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Optional.of(new JwtClaim(
                    claims.get("accountId", Long.class),
                    claims.getSubject(),
                    UUID.fromString(claims.get("accountUuid", String.class))
            ));
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }

    private SecretKey secretKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.getSecret()));
    }
}

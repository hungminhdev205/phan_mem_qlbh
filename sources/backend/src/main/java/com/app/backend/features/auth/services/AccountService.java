package com.app.backend.features.auth.services;

import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.common.response.SqlResponse;
import com.app.backend.features.auth.repositories.AccountRepository;
import com.app.backend.security.token.JwtClaim;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
    private final AccountRepository accountRepository;
    private final ObjectMapper objectMapper;

    public Map<String, Object> getMeService(JwtClaim claim) {
        if (claim == null || claim.accountId() == null) {
            throw new AppException(ErrorCode.AUTH_UNAUTHORIZED);
        }

        String rawResponse = accountRepository.getAccountInfo(claim.accountId());
        try {
            SqlResponse<Map<String, Object>> response = objectMapper.readValue(rawResponse, new TypeReference<>() {
            });
            if (!response.success()) {
                throw AppException.withMessageKey(ErrorCode.RESOURCE_NOT_FOUND, response.msg());
            }
            return response.data();
        } catch (Exception exception) {
            if (exception instanceof AppException appException) {
                throw appException;
            }
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}

package com.app.backend.features.auth.services;

import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.common.enums.RecordType;
import com.app.backend.features.auth.dtos.LoginDto;
import com.app.backend.features.business.repositories.EmployeeRepository;
import com.app.backend.features.auth.repositories.AuthRepository;
import com.app.backend.security.token.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthRepository authRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginDto.Response loginService(LoginDto.Request request) {

        var account = authRepository.findByUsername(request.username())
                .orElseThrow(() -> new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(request.password(), account.getPassword())) {
            throw new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        var employee = employeeRepository.findByAccountId(account.getId())
                .orElseThrow(() -> new AppException(ErrorCode.AUTH_EMPLOYEE_INACTIVE));
        if (employee.getStatus() != RecordType.active) {
            throw new AppException(ErrorCode.AUTH_EMPLOYEE_INACTIVE);
        }

        String token = jwtService.generateToken(account);

        return new LoginDto.Response(token);
    }
}

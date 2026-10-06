package com.app.backend.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    AUTH_INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "error.auth.invalid_credentials"),
    AUTH_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "error.auth.unauthorized"),
    AUTH_EMPLOYEE_INACTIVE(HttpStatus.FORBIDDEN, "error.auth.employee_inactive"),
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "error.account.not_found"),
    PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "error.profile.not_found"),
    EMPLOYEE_NOT_FOUND(HttpStatus.NOT_FOUND, "error.employee.not_found"),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "error.resource.not_found"),
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "error.validation.failed"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "error.bad_request"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "error.internal_server");

    private final HttpStatus status;
    private final String messageKey;
}

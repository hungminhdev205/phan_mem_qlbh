package com.app.backend.common.exception;

import com.app.backend.common.response.ApiResponse;
import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.sql.SQLException;
import java.util.Locale;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    // Loi nghiep vu chu dong nem tu service, vi du sai dang nhap hoac du lieu khong ton tai.
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse.Failed<?>> handleAppException(AppException exception, HttpServletRequest request) {
        ErrorCode errorCode = exception.getErrorCode();
        String detail = exception.getDetail() == null
                ? message(errorCode.getMessageKey())
                : message(exception.getDetail());
        return buildResponse(errorCode, detail, request);
    }

    // Loi validate request body, vi du @NotBlank, @NotNull, @Valid.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse.Failed<?>> handleMethodArgumentNotValid(MethodArgumentNotValidException exception, HttpServletRequest request) {
        String detail = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(this::message)
                .orElse(message(ErrorCode.VALIDATION_FAILED.getMessageKey()));
        return buildResponse(ErrorCode.VALIDATION_FAILED, detail, request);
    }

    // Loi goi sai endpoint/resource khong ton tai.
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse.Failed<?>> handleNoResourceFound(NoResourceFoundException exception, HttpServletRequest request) {
        return buildResponse(ErrorCode.BAD_REQUEST, message(ErrorCode.BAD_REQUEST.getMessageKey()), request);
    }

    // Loi database/SQL/JPA nghiem trong: log chi tiet noi bo, khong tra loi SQL truc tiep cho user.
    @ExceptionHandler({DataAccessException.class, SQLException.class, PersistenceException.class})
    public ResponseEntity<ApiResponse.Failed<?>> handleDatabaseException(Exception exception, HttpServletRequest request) {
        log.error("Database error at {} {}", request.getMethod(), request.getRequestURI(), exception);
        return buildResponse(ErrorCode.INTERNAL_SERVER_ERROR, message(ErrorCode.INTERNAL_SERVER_ERROR.getMessageKey()), request);
    }

    // Fallback cho cac loi runtime ngoai du kien.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse.Failed<?>> handleException(Exception exception, HttpServletRequest request) {
        log.error("Unexpected error at {} {}", request.getMethod(), request.getRequestURI(), exception);
        return buildResponse(ErrorCode.INTERNAL_SERVER_ERROR, message(ErrorCode.INTERNAL_SERVER_ERROR.getMessageKey()), request);
    }

    // Dinh dang response loi chung cho toan bo API.
    private ResponseEntity<ApiResponse.Failed<?>> buildResponse(ErrorCode errorCode, String detail, HttpServletRequest request) {
        HttpStatus status = errorCode.getStatus();
        ApiResponse.Failed<?> response = ApiResponse.Failed.of(
                status.getReasonPhrase(),
                status.value(),
                detail,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(response);
    }

    // Dich message cua validation error theo locale hien tai.
    private String message(ObjectError error) {
        return messageSource.getMessage(error, LocaleContextHolder.getLocale());
    }

    // Dich message key tu ErrorCode hoac tu SQL response, ho tro dang "{message.key}".
    private String message(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        if (key.startsWith("{") && key.endsWith("}")) {
            key = key.substring(1, key.length() - 1);
        }
        return messageSource.getMessage(key, null, key, locale);
    }
}

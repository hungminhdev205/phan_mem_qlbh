package com.app.backend.common.response;

public record SqlResponse<T>(
        boolean success,
        String msg,
        T data
) {
}

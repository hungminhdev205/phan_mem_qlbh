package com.app.backend.common.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class ApiResponse {
    @Getter
    @Builder
    @AllArgsConstructor
    @JsonPropertyOrder({"success", "msg", "data", "timestamp"})
    public static class Success <T> {
        private boolean success;
        private String msg;
        private T data;
        public static <T> Success<T> ok(String msg, T data) {
            return Success.<T>builder()
                    .success(true)
                    .msg(msg)
                    .data(data)
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @JsonPropertyOrder({"type", "title", "status", "detail", "instance"})
    public static class Failed <T> {
        private String type;
        private String title;
        private int status;
        private String detail;
        private String instance;
        public static <T> Failed<T> of(String title, int status, String detail, String instance) {
            return Failed.<T>builder()
                    .type("about:blank")
                    .title(title)
                    .status(status)
                    .detail(detail)
                    .instance(instance)
                    .build();
        }
    }
}

package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.Customer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CustomerDto {
    public record Request(
            @NotBlank(message = "{validation.customer.code.required}")
            @Size(max = 50, message = "{validation.customer.code.max}")
            String code,

            @NotBlank(message = "{validation.customer.name.required}")
            @Size(max = 255, message = "{validation.customer.name.max}")
            String name,

            @Size(max = 30, message = "{validation.customer.phone.max}")
            String phone,

            @Size(max = 255, message = "{validation.customer.email.max}")
            String email,

            String address,

            @Size(max = 50, message = "{validation.customer.rank.max}")
            String rankName,

            BigDecimal debtAmount,
            RecordType status
    ) {
    }

    public record Response(
            UUID uuid,
            String code,
            String name,
            String phone,
            String email,
            String address,
            String rankName,
            BigDecimal debtAmount,
            RecordType status,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(Customer customer) {
            return new Response(
                    customer.getUuid(),
                    customer.getCode(),
                    customer.getName(),
                    customer.getPhone(),
                    customer.getEmail(),
                    customer.getAddress(),
                    customer.getRankName(),
                    customer.getDebtAmount(),
                    customer.getStatus(),
                    customer.getCreatedAt(),
                    customer.getUpdatedAt()
            );
        }
    }
}

package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.CashBookEntry;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CashBookEntryDto {
    public record Request(
            @NotBlank(message = "{validation.cashbook.type.required}")
            @Size(max = 20, message = "{validation.cashbook.type.max}")
            String entryType,

            @Size(max = 50, message = "{validation.payment_method.max}")
            String paymentMethod,

            BigDecimal amount,

            @NotBlank(message = "{validation.cashbook.title.required}")
            @Size(max = 255, message = "{validation.cashbook.title.max}")
            String title,

            String description,
            OffsetDateTime occurredAt,
            RecordType status
    ) {
    }

    public record Response(
            UUID uuid,
            String code,
            String entryType,
            String paymentMethod,
            BigDecimal amount,
            String title,
            String description,
            RecordType status,
            OffsetDateTime occurredAt,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(CashBookEntry entry) {
            return new Response(
                    entry.getUuid(),
                    entry.getCode(),
                    entry.getEntryType(),
                    entry.getPaymentMethod(),
                    entry.getAmount(),
                    entry.getTitle(),
                    entry.getDescription(),
                    entry.getStatus(),
                    entry.getOccurredAt(),
                    entry.getCreatedAt(),
                    entry.getUpdatedAt()
            );
        }
    }
}

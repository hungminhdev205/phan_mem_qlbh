package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.GoldType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class GoldTypeDto {
    public record Request(
            @NotBlank(message = "{validation.gold_type.code.required}")
            @Size(max = 50, message = "{validation.gold_type.code.max}")
            String code,

            @NotBlank(message = "{validation.gold_type.name.required}")
            @Size(max = 100, message = "{validation.gold_type.name.max}")
            String name,

            BigDecimal purity,
            String description,
            RecordType status
    ) {
    }

    public record Response(
            UUID uuid,
            String code,
            String name,
            BigDecimal purity,
            String description,
            RecordType status,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(GoldType goldType) {
            if (goldType == null) {
                return null;
            }
            return new Response(
                    goldType.getUuid(),
                    goldType.getCode(),
                    goldType.getName(),
                    goldType.getPurity(),
                    goldType.getDescription(),
                    goldType.getStatus(),
                    goldType.getCreatedAt(),
                    goldType.getUpdatedAt()
            );
        }
    }
}

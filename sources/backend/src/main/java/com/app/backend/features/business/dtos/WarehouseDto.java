package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.Warehouse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.UUID;

public class WarehouseDto {
    public record Request(
            @NotBlank(message = "{validation.warehouse.code.required}")
            @Size(max = 50, message = "{validation.warehouse.code.max}")
            String code,

            @NotBlank(message = "{validation.warehouse.name.required}")
            @Size(max = 255, message = "{validation.warehouse.name.max}")
            String name,

            String address,
            RecordType status
    ) {
    }

    public record Response(
            UUID uuid,
            String code,
            String name,
            String address,
            RecordType status,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(Warehouse warehouse) {
            return new Response(
                    warehouse.getUuid(),
                    warehouse.getCode(),
                    warehouse.getName(),
                    warehouse.getAddress(),
                    warehouse.getStatus(),
                    warehouse.getCreatedAt(),
                    warehouse.getUpdatedAt()
            );
        }
    }
}

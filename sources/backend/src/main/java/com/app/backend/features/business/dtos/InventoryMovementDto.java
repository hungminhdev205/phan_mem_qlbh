package com.app.backend.features.business.dtos;

import com.app.backend.entities.InventoryMovement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class InventoryMovementDto {
    public record Request(
            @NotBlank(message = "{validation.inventory.movement_type.required}")
            @Size(max = 30, message = "{validation.inventory.movement_type.max}")
            String movementType,

            UUID sourceWarehouseUuid,
            UUID targetWarehouseUuid,

            @NotNull(message = "{validation.stock.product.required}")
            UUID productUuid,

            BigDecimal quantity,
            BigDecimal unitCost,
            String note
    ) {
    }

    public record Response(
            UUID uuid,
            String code,
            String movementType,
            WarehouseDto.Response sourceWarehouse,
            WarehouseDto.Response targetWarehouse,
            ProductDto.Response product,
            BigDecimal quantity,
            BigDecimal unitCost,
            String note,
            OffsetDateTime createdAt
    ) {
        public static Response from(InventoryMovement movement) {
            return new Response(
                    movement.getUuid(),
                    movement.getCode(),
                    movement.getMovementType(),
                    movement.getSourceWarehouse() == null ? null : WarehouseDto.Response.from(movement.getSourceWarehouse()),
                    movement.getTargetWarehouse() == null ? null : WarehouseDto.Response.from(movement.getTargetWarehouse()),
                    ProductDto.Response.from(movement.getProduct()),
                    movement.getQuantity(),
                    movement.getUnitCost(),
                    movement.getNote(),
                    movement.getCreatedAt()
            );
        }
    }
}

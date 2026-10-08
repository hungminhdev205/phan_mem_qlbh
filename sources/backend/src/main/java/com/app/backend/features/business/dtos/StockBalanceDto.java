package com.app.backend.features.business.dtos;

import com.app.backend.entities.StockBalance;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class StockBalanceDto {
    public record Request(
            @NotNull(message = "{validation.stock.warehouse.required}")
            UUID warehouseUuid,

            @NotNull(message = "{validation.stock.product.required}")
            UUID productUuid,

            BigDecimal quantity,
            BigDecimal minQuantity,
            String locationCode
    ) {
    }

    public record Response(
            UUID uuid,
            WarehouseDto.Response warehouse,
            ProductDto.Response product,
            BigDecimal quantity,
            BigDecimal minQuantity,
            String locationCode,
            OffsetDateTime updatedAt
    ) {
        public static Response from(StockBalance stockBalance) {
            return new Response(
                    stockBalance.getUuid(),
                    WarehouseDto.Response.from(stockBalance.getWarehouse()),
                    ProductDto.Response.from(stockBalance.getProduct()),
                    stockBalance.getQuantity(),
                    stockBalance.getMinQuantity(),
                    stockBalance.getLocationCode(),
                    stockBalance.getUpdatedAt()
            );
        }
    }
}

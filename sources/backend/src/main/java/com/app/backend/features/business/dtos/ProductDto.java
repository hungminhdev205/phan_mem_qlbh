package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class ProductDto {
    public record Request(
            UUID goldTypeUuid,
            UUID supplierUuid,

            @NotBlank(message = "{validation.product.code.required}")
            @Size(max = 50, message = "{validation.product.code.max}")
            String code,

            @NotBlank(message = "{validation.product.name.required}")
            @Size(max = 255, message = "{validation.product.name.max}")
            String name,

            @NotBlank(message = "{validation.product.category.required}")
            @Size(max = 100, message = "{validation.product.category.max}")
            String categoryName,

            @Size(max = 50, message = "{validation.product.unit.max}")
            String unitName,

            BigDecimal weight,
            BigDecimal goldWeight,
            BigDecimal stoneWeight,
            BigDecimal laborCost,
            BigDecimal stoneCost,
            BigDecimal baseLaborCost,
            BigDecimal baseStoneCost,
            BigDecimal costPrice,
            BigDecimal purchasePrice,
            BigDecimal salePrice,
            Boolean fixedPrice,
            BigDecimal vatRate,
            RecordType status
    ) {
    }

    public record Response(
            UUID uuid,
            String code,
            String name,
            String categoryName,
            String unitName,
            BigDecimal weight,
            BigDecimal goldWeight,
            BigDecimal stoneWeight,
            BigDecimal laborCost,
            BigDecimal stoneCost,
            BigDecimal baseLaborCost,
            BigDecimal baseStoneCost,
            BigDecimal costPrice,
            BigDecimal purchasePrice,
            BigDecimal salePrice,
            Boolean fixedPrice,
            BigDecimal vatRate,
            RecordType status,
            GoldTypeDto.Response goldType,
            SupplierDto.Response supplier,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(Product product) {
            return new Response(
                    product.getUuid(),
                    product.getCode(),
                    product.getName(),
                    product.getCategoryName(),
                    product.getUnitName(),
                    product.getWeight(),
                    product.getGoldWeight(),
                    product.getStoneWeight(),
                    product.getLaborCost(),
                    product.getStoneCost(),
                    product.getBaseLaborCost(),
                    product.getBaseStoneCost(),
                    product.getCostPrice(),
                    product.getPurchasePrice(),
                    product.getSalePrice(),
                    product.getFixedPrice(),
                    product.getVatRate(),
                    product.getStatus(),
                    GoldTypeDto.Response.from(product.getGoldType()),
                    product.getSupplier() == null ? null : SupplierDto.Response.from(product.getSupplier()),
                    product.getCreatedAt(),
                    product.getUpdatedAt()
            );
        }
    }
}

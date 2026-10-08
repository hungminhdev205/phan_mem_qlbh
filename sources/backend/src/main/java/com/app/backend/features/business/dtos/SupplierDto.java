package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.Supplier;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.UUID;

public class SupplierDto {
    public record Request(
            @NotNull(message = "{validation.supplier.tag_category.required}")
            UUID tagCategoryUuid,

            @NotBlank(message = "{validation.supplier.code.required}")
            @Size(max = 50, message = "{validation.supplier.code.max}")
            String code,

            @NotBlank(message = "{validation.supplier.name.required}")
            @Size(max = 255, message = "{validation.supplier.name.max}")
            String name,

            @Size(max = 30, message = "{validation.supplier.phone.max}")
            String phone,

            @Size(max = 255, message = "{validation.supplier.email.max}")
            String email,

            String address,

            @Size(max = 30, message = "{validation.supplier.tax_code.max}")
            String taxCode,

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
            String taxCode,
            RecordType status,
            TagCategoryDto.Response tagCategory,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(Supplier supplier) {
            return new Response(
                    supplier.getUuid(),
                    supplier.getCode(),
                    supplier.getName(),
                    supplier.getPhone(),
                    supplier.getEmail(),
                    supplier.getAddress(),
                    supplier.getTaxCode(),
                    supplier.getStatus(),
                    TagCategoryDto.Response.from(supplier.getTagCategory()),
                    supplier.getCreatedAt(),
                    supplier.getUpdatedAt()
            );
        }
    }
}

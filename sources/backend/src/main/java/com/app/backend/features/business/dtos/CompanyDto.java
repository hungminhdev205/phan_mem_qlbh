package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.Company;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.UUID;

public class CompanyDto {
    public record Request(
            @NotBlank(message = "{validation.company.name.required}")
            @Size(max = 255, message = "{validation.company.name.max}")
            String name,

            String address,

            @Size(max = 20, message = "{validation.company.phone.max}")
            String phone,

            @Size(max = 255, message = "{validation.company.email.max}")
            String email,

            @NotBlank(message = "{validation.company.tax_code.required}")
            @Size(max = 20, message = "{validation.company.tax_code.max}")
            String taxCode,

            RecordType status
    ) {
    }

    public record Response(
            UUID uuid,
            String name,
            String address,
            String phone,
            String email,
            String taxCode,
            RecordType status,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(Company company) {
            return new Response(
                    company.getUuid(),
                    company.getName(),
                    company.getAddress(),
                    company.getPhone(),
                    company.getEmail(),
                    company.getTaxCode(),
                    company.getStatus(),
                    company.getCreatedAt(),
                    company.getUpdatedAt()
            );
        }
    }
}

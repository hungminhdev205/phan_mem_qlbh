package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.TagCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.UUID;

public class TagCategoryDto {
    public record Request(
            @NotBlank(message = "{validation.tag_category.code.required}")
            @Size(max = 50, message = "{validation.tag_category.code.max}")
            String code,

            @NotBlank(message = "{validation.tag_category.name.required}")
            @Size(max = 255, message = "{validation.tag_category.name.max}")
            String name,

            String description,

            RecordType status
    ) {
    }

    public record Response(
            UUID uuid,
            String code,
            String name,
            String description,
            RecordType status,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(TagCategory tagCategory) {
            return new Response(
                    tagCategory.getUuid(),
                    tagCategory.getCode(),
                    tagCategory.getName(),
                    tagCategory.getDescription(),
                    tagCategory.getStatus(),
                    tagCategory.getCreatedAt(),
                    tagCategory.getUpdatedAt()
            );
        }
    }
}

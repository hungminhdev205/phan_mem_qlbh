package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.TagCategory;
import com.app.backend.features.business.dtos.TagCategoryDto;
import com.app.backend.features.business.repositories.TagCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TagCategoryService {
    private final TagCategoryRepository tagCategoryRepository;

    public List<TagCategoryDto.Response> getTagCategories(String keyword) {
        String search = keyword == null ? "" : keyword.trim();
        List<TagCategory> categories = tagCategoryRepository.searchNative(search);
        return categories.stream().map(TagCategoryDto.Response::from).toList();
    }

    @Transactional
    public TagCategoryDto.Response createTagCategory(TagCategoryDto.Request request) {
        UUID uuid = UUID.randomUUID();
        tagCategoryRepository.insertNative(
                uuid,
                request.code().trim().toUpperCase(),
                request.name().trim(),
                blankToNull(request.description()),
                (request.status() == null ? RecordType.active : request.status()).name()
        );
        return TagCategoryDto.Response.from(getActiveTagCategory(uuid));
    }

    @Transactional
    public TagCategoryDto.Response updateTagCategory(UUID uuid, TagCategoryDto.Request request) {
        getActiveTagCategory(uuid);
        tagCategoryRepository.updateNative(
                uuid,
                request.code().trim().toUpperCase(),
                request.name().trim(),
                blankToNull(request.description()),
                (request.status() == null ? RecordType.active : request.status()).name()
        );
        return TagCategoryDto.Response.from(getActiveTagCategory(uuid));
    }

    @Transactional
    public void deleteTagCategory(UUID uuid) {
        getActiveTagCategory(uuid);
        tagCategoryRepository.softDeleteNative(uuid);
    }

    public TagCategory getActiveTagCategory(UUID uuid) {
        TagCategory tagCategory = tagCategoryRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (tagCategory.getStatus() == RecordType.deleted) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return tagCategory;
    }

    private void applyRequest(TagCategory tagCategory, TagCategoryDto.Request request) {
        tagCategory.setCode(request.code().trim().toUpperCase());
        tagCategory.setName(request.name().trim());
        tagCategory.setDescription(blankToNull(request.description()));
        tagCategory.setStatus(request.status() == null ? RecordType.active : request.status());
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}

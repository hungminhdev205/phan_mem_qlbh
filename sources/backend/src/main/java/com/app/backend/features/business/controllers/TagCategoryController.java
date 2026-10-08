package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.TagCategoryDto;
import com.app.backend.features.business.services.TagCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/catalog/tag-categories")
@RequiredArgsConstructor
public class TagCategoryController {
    private final TagCategoryService tagCategoryService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<TagCategoryDto.Response>>> getTagCategories(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get tag categories successfully", tagCategoryService.getTagCategories(keyword)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<TagCategoryDto.Response>> createTagCategory(
            @Valid @RequestBody TagCategoryDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create tag category successfully", tagCategoryService.createTagCategory(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<TagCategoryDto.Response>> updateTagCategory(
            @PathVariable UUID uuid,
            @Valid @RequestBody TagCategoryDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update tag category successfully", tagCategoryService.updateTagCategory(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteTagCategory(@PathVariable UUID uuid) {
        tagCategoryService.deleteTagCategory(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete tag category successfully", null));
    }
}

package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.GoldTypeDto;
import com.app.backend.features.business.services.GoldTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/catalog/gold-types")
@RequiredArgsConstructor
public class GoldTypeController {
    private final GoldTypeService goldTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<GoldTypeDto.Response>>> getGoldTypes(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get gold types successfully", goldTypeService.getGoldTypes(keyword)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<GoldTypeDto.Response>> createGoldType(
            @Valid @RequestBody GoldTypeDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create gold type successfully", goldTypeService.createGoldType(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<GoldTypeDto.Response>> updateGoldType(
            @PathVariable UUID uuid,
            @Valid @RequestBody GoldTypeDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update gold type successfully", goldTypeService.updateGoldType(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteGoldType(@PathVariable UUID uuid) {
        goldTypeService.deleteGoldType(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete gold type successfully", null));
    }
}

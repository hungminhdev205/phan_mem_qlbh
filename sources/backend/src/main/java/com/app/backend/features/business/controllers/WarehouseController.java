package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.WarehouseDto;
import com.app.backend.features.business.services.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<WarehouseDto.Response>>> getWarehouses(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get warehouses successfully", warehouseService.getWarehouses(keyword)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<WarehouseDto.Response>> createWarehouse(
            @Valid @RequestBody WarehouseDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create warehouse successfully", warehouseService.createWarehouse(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<WarehouseDto.Response>> updateWarehouse(
            @PathVariable UUID uuid,
            @Valid @RequestBody WarehouseDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update warehouse successfully", warehouseService.updateWarehouse(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteWarehouse(@PathVariable UUID uuid) {
        warehouseService.deleteWarehouse(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete warehouse successfully", null));
    }
}

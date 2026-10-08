package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.InventoryMovementDto;
import com.app.backend.features.business.services.InventoryMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory/movements")
@RequiredArgsConstructor
public class InventoryMovementController {
    private final InventoryMovementService inventoryMovementService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<InventoryMovementDto.Response>>> getMovements() {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get inventory movements successfully", inventoryMovementService.getMovements()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<InventoryMovementDto.Response>> createMovement(
            @Valid @RequestBody InventoryMovementDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create inventory movement successfully", inventoryMovementService.createMovement(request)));
    }
}

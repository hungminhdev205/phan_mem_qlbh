package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.SupplierDto;
import com.app.backend.features.business.services.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/business/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<SupplierDto.Response>>> getSuppliers(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get suppliers successfully", supplierService.getSuppliers(keyword)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<SupplierDto.Response>> createSupplier(
            @Valid @RequestBody SupplierDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create supplier successfully", supplierService.createSupplier(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<SupplierDto.Response>> updateSupplier(
            @PathVariable UUID uuid,
            @Valid @RequestBody SupplierDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update supplier successfully", supplierService.updateSupplier(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteSupplier(@PathVariable UUID uuid) {
        supplierService.deleteSupplier(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete supplier successfully", null));
    }
}

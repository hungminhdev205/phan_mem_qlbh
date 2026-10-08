package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.SaleTransactionDto;
import com.app.backend.features.business.services.SaleTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sales/transactions")
@RequiredArgsConstructor
public class SaleTransactionController {
    private final SaleTransactionService saleTransactionService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<SaleTransactionDto.Response>>> getRecentTransactions() {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get sale transactions successfully", saleTransactionService.getRecentTransactions()));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<SaleTransactionDto.Response>> getTransaction(@PathVariable UUID uuid) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get sale transaction successfully", saleTransactionService.getTransaction(uuid)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<SaleTransactionDto.Response>> createSale(
            @Valid @RequestBody SaleTransactionDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create sale transaction successfully", saleTransactionService.createSale(request)));
    }
}

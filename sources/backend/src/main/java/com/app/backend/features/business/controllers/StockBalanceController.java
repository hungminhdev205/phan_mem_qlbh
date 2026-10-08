package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.StockBalanceDto;
import com.app.backend.features.business.services.StockBalanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/stock-balances")
@RequiredArgsConstructor
public class StockBalanceController {
    private final StockBalanceService stockBalanceService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<StockBalanceDto.Response>>> getStockBalances() {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get stock balances successfully", stockBalanceService.getStockBalances()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<StockBalanceDto.Response>> createStockBalance(
            @Valid @RequestBody StockBalanceDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create stock balance successfully", stockBalanceService.createStockBalance(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<StockBalanceDto.Response>> updateStockBalance(
            @PathVariable UUID uuid,
            @Valid @RequestBody StockBalanceDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update stock balance successfully", stockBalanceService.updateStockBalance(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteStockBalance(@PathVariable UUID uuid) {
        stockBalanceService.deleteStockBalance(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete stock balance successfully", null));
    }
}

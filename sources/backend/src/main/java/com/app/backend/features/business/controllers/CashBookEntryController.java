package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.CashBookEntryDto;
import com.app.backend.features.business.services.CashBookEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/finance/cash-book")
@RequiredArgsConstructor
public class CashBookEntryController {
    private final CashBookEntryService cashBookEntryService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<CashBookEntryDto.Response>>> getEntries() {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get cash book entries successfully", cashBookEntryService.getEntries()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<CashBookEntryDto.Response>> createEntry(
            @Valid @RequestBody CashBookEntryDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create cash book entry successfully", cashBookEntryService.createEntry(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<CashBookEntryDto.Response>> updateEntry(
            @PathVariable UUID uuid,
            @Valid @RequestBody CashBookEntryDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update cash book entry successfully", cashBookEntryService.updateEntry(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteEntry(@PathVariable UUID uuid) {
        cashBookEntryService.deleteEntry(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete cash book entry successfully", null));
    }
}

package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.CompanyDto;
import com.app.backend.features.business.services.CompanyService;
import com.app.backend.security.token.JwtClaim;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/business/companies")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<CompanyDto.Response>>> getCompanies(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get companies successfully", companyService.getCompanies(keyword)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<CompanyDto.Response>> createCompany(
            @AuthenticationPrincipal JwtClaim claim,
            @Valid @RequestBody CompanyDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create company successfully", companyService.createCompany(request, claim)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<CompanyDto.Response>> updateCompany(
            @AuthenticationPrincipal JwtClaim claim,
            @PathVariable UUID uuid,
            @Valid @RequestBody CompanyDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update company successfully", companyService.updateCompany(uuid, request, claim)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteCompany(@PathVariable UUID uuid) {
        companyService.deleteCompany(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete company successfully", null));
    }
}

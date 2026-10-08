package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.CustomerDto;
import com.app.backend.features.business.services.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/business/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<CustomerDto.Response>>> getCustomers(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get customers successfully", customerService.getCustomers(keyword)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<CustomerDto.Response>> createCustomer(
            @Valid @RequestBody CustomerDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create customer successfully", customerService.createCustomer(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<CustomerDto.Response>> updateCustomer(
            @PathVariable UUID uuid,
            @Valid @RequestBody CustomerDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update customer successfully", customerService.updateCustomer(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteCustomer(@PathVariable UUID uuid) {
        customerService.deleteCustomer(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete customer successfully", null));
    }
}

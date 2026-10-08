package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.ProductDto;
import com.app.backend.features.business.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/catalog/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<ProductDto.Response>>> getProducts(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get products successfully", productService.getProducts(keyword)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Success<ProductDto.Response>> createProduct(
            @Valid @RequestBody ProductDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create product successfully", productService.createProduct(request)));
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<ProductDto.Response>> updateProduct(
            @PathVariable UUID uuid,
            @Valid @RequestBody ProductDto.Request request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update product successfully", productService.updateProduct(uuid, request)));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteProduct(@PathVariable UUID uuid) {
        productService.deleteProduct(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete product successfully", null));
    }
}
